<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import Button from './Button.svelte';
	import { browser } from '$app/environment';

	interface RecordingTileProps {
		name: string;
		url: string;
		recordings: { name: string; url: string }[];
	}

	let { name, url, recordings }: RecordingTileProps = $props();
	let isPlaying = $state(false);
	let waveformContainer: HTMLElement;
	let wavesurfer: WaveSurfer;
	let waveColor = $state(
		browser && window.matchMedia('(prefers-color-scheme: dark)').matches
			? '#ffffff'
			: browser && window.matchMedia('(prefers-color-scheme: light)').matches
				? '#000000'
				: ''
	);

	onMount(() => {
		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor,
			progressColor: '#ddd',
			cursorColor: '#ddd',
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

	<div class="actions">
		<Button kind="primary" onclick={togglePlay} label={isPlaying ? 'Pause' : 'Play'} />

		<Button download={name} href={url} label="Download"></Button>

		<Button
			kind="danger"
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
</div>

<style>
	.recording-tile {
		background: var(--c-body-dark);
		color: var(--c-text);
		/* padding: 1rem; */
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	h3 {
		padding: 1rem;
	}

	.actions {
		padding: 1rem;
		display: grid;
		gap: 1rem;
	}

	/* div[bind:this='waveformContainer'] {
		width: 100%;
	} */
</style>
