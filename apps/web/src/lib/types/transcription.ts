export interface Transcription {
	text: string;
	vtt: string;
	word_count: number;
	words: { word?: string; text?: string; start: number; end: number }[];
}
