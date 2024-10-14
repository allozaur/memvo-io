export default async function transcribeRecording(
	audioBlob: Blob
): Promise<{ text: string } | null> {
	try {
		const formData = new FormData();
		const newBlob = new Blob([audioBlob], { type: 'audio/webm' });

		formData.append('audio', newBlob, 'audio.webm');

		const response = await fetch('/api/transcribe', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Error in transcription request');
		}

		const result = await response.json();

		return result;
	} catch (error) {
		console.error('Error fetching transcription:', error);
		return null;
	}
}
