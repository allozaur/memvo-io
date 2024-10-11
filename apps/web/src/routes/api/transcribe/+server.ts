import { error, json, text } from '@sveltejs/kit';
import OpenAI from 'openai';
import type { RequestHandler } from './$types';
import { env as envPrivate } from '$env/dynamic/private';

const openai = envPrivate.OPENAI_API_KEY
	? new OpenAI({
			apiKey: envPrivate.OPENAI_API_KEY
		})
	: undefined;

export const POST: RequestHandler = async ({ request }) => {
	if (!openai) {
		return error(500, 'OpenAI API key not provided');
	}

	try {
		const data = await request.formData();
		const audioFile = data.get('audio') as File;

		if (!audioFile) {
			return json({ error: 'No audio file provided' }, { status: 400 });
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 60000);

		const transcription = await openai.audio.transcriptions.create({
			file: audioFile,
			model: 'whisper-1',
			response_format: 'text'
		});

		clearTimeout(timeoutId);

		return text(transcription);
	} catch (err: any) {
		if (err.name === 'AbortError') {
			console.error('Request timed out:', err);
			return error(408, 'Request timed out');
		}

		console.error('Error during transcription:', err);
		return error(500, err.message);
	}
};
