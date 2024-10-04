import type RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';

export default function togglePause(record: RecordPlugin, isPaused: boolean) {
	if (record.isPaused()) {
		isPaused = false;
		record.resumeRecording();
	} else {
		isPaused = true;
		record.pauseRecording();
	}
}
