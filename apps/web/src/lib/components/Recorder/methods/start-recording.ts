import type RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';

export default function startRecording(
	record: RecordPlugin,
	isRecording: boolean,
	deviceId: string
) {
	if (!deviceId) {
		alert('Choose a recording device!');
		return;
	}

	if (record.isRecording() || record.isPaused()) {
		record.stopRecording();

		return;
	}

	record.startRecording({ deviceId }).then(() => {
		isRecording = true;
	});
}
