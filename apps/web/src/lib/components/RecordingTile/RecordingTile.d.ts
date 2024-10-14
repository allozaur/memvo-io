import type { Transcription } from '$lib/types';
import { onMount, type Snippet } from 'svelte';

export interface RecordingTileProps {
	data: string;
	deleteRecording?: () => void;
	id: string;
	name: string;
	savedRecordings?: any[];
	titleSlot?: Snippet;
	transcription?: Transcription;
}
