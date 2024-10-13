export interface Transcription {
	text: string;
	vtt: string;
	word_count: number;
	words: { word: string; start: number; end: number }[];
}
