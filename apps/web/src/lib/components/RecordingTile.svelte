<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import Button from './Button.svelte';

	interface RecordingTileProps {
		name: string;
		url: string;
		recordings: { name: string; url: string }[];
	}

	let { name, url, recordings }: RecordingTileProps = $props();
	let isPlaying = $state(false);
	let waveformContainer: HTMLElement;
	let wavesurfer: WaveSurfer;

	onMount(() => {
		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: '#ddd',
			progressColor: '#2196f3',
			cursorColor: '#2196f3',
			height: 100,
			barWidth: 2,
			barRadius: 3,
			backend: 'MediaElement'
		});

		// Load audio from the URL
		wavesurfer.load(url);

		// Cleanup the wavesurfer instance when the component is destroyed
		return () => wavesurfer.destroy();
	});

	function togglePlay() {
		wavesurfer.playPause();
		isPlaying = !isPlaying;
	}
</script>

<div class="recording-tile">
	<h3>{name}</h3>

	<div bind:this={waveformContainer}></div>

	<Button kind="primary" onclick={togglePlay} label={isPlaying ? 'Pause' : 'Play'} />

	<Button download={name} href={url} label="Download"></Button>

	<Button
		kind="secondary"
		onclick={() => {
			if (confirm('Do you want to delete this recording?')) {
				recordings.splice(
					recordings.findIndex((r) => r.name === name),
					1
				);
			}
		}}
		label="Delete"
	/>
</div>

<style>
	.recording-tile {
		border: 1px solid var(--c-text-light);
		border-radius: 1.25rem;
		background: var(--c-surface);
		color: var(--c-text);
		padding: 1rem;
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	/* div[bind:this='waveformContainer'] {
		width: 100%;
	} */
</style>
