import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env as envPrivate } from '$env/dynamic/private';
import { ElevenLabsClient } from 'elevenlabs';

const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${envPrivate.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/openai/whisper`;

export const POST: RequestHandler = async ({ request, url }) => {
	if (!envPrivate.CLOUDFLARE_WORKERS_AI_API_TOKEN || !envPrivate.CLOUDFLARE_ACCOUNT_ID) {
		return error(500, 'Cloudflare API credentials not provided');
	}

	if (request.headers.get('origin') !== url.origin) {
		return error(403, 'Forbidden');
	}

	try {
		const data = await request.formData();
		const audioFile = data.get('audio') as File;
		const model = data.get('model') as string;

		if (!audioFile) {
			return json({ error: 'No audio file provided' }, { status: 400 });
		}

		switch (model) {
			case 'openai-whisper': {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 60000);

				const response = await fetch(CLOUDFLARE_API_URL, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${envPrivate.CLOUDFLARE_WORKERS_AI_API_TOKEN}`,
						'Content-Type': 'application/octet-stream'
					},
					body: audioFile,
					signal: controller.signal
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(`Cloudflare API error: ${response.statusText}`);
				}

				const res = await response.json();

				return json({ ...res.result });
			}

			case 'elevenlabs-scribe-v1':
			default: {
				if (!envPrivate.ELEVENLABS_API_KEY) {
					return error(500, 'ElevenLabs API key not provided');
				}

				try {
					const client = new ElevenLabsClient({
						apiKey: envPrivate.ELEVENLABS_API_KEY
					});

					const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });

					const transcription = await client.speechToText.convert({
						file: audioBlob,
						model_id: 'scribe_v1',
						tag_audio_events: true,
						language_code: 'en',
						diarize: true
					});

					return json({
						text: transcription.words.map(({ text }) => text).toString(),
						words: transcription.words
					});
				} catch (elevenLabsError: any) {
					console.error('ElevenLabs API error:', elevenLabsError);
					return error(500, `ElevenLabs API error: ${elevenLabsError.message}`);
				}
			}
		}
	} catch (err: any) {
		if (err.name === 'AbortError') {
			console.error('Request timed out:', err);
			return error(408, 'Request timed out');
		}

		console.error('Error during transcription:', err);
		return error(500, err.message);
	}
};
