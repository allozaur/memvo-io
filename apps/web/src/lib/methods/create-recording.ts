import type { Transcription } from '$lib/types';
import blobToBase64 from '$lib/utils/blob-to-base64';

export default async function createRecording(recordingUrl: string): Promise<{
	id: string;
	name: string;
	data: string;
	transcription: Transcription | undefined;
}> {
	const response = await fetch(recordingUrl);

	const recordingBlob = await response.blob();
	const recordingId = crypto.randomUUID();

	return {
		id: recordingId,
		name: `${new Date().toISOString()}-${recordingId}.webm`,
		data: await blobToBase64(recordingBlob),
		transcription: undefined
	};
}
