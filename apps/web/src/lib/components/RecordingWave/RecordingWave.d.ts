import type WaveSurfer from 'wavesurfer.js';

export interface RecordingWaveProps {
	data: string;
	wavesurfer?: WaveSurfer | undefined;
}
