import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env as envPrivate } from '$env/dynamic/private';

const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${envPrivate.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/openai/whisper`;

export const POST: RequestHandler = async ({ request }) => {
	if (!envPrivate.CLOUDFLARE_WORKERS_AI_API_TOKEN || !envPrivate.CLOUDFLARE_ACCOUNT_ID) {
		return error(500, 'Cloudflare API credentials not provided');
	}

	try {
		const data = await request.formData();
		const audioFile = data.get('audio') as File;

		if (!audioFile) {
			return json({ error: 'No audio file provided' }, { status: 400 });
		}

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
	} catch (err: any) {
		if (err.name === 'AbortError') {
			console.error('Request timed out:', err);
			return error(408, 'Request timed out');
		}

		console.error('Error during transcription:', err);
		return error(500, err.message);
	}
};
