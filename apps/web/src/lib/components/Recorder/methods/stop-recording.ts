import type RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';

export default function stopRecording(
	record: RecordPlugin,
	isPaused: boolean,
	isRecording: boolean
) {
	record.stopRecording();
	isPaused = false;
	isRecording = false;
}
