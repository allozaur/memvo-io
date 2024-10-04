<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';

	interface RecordingTileProps {
		name?: string;
		url: string;
	}

	let { name, url }: RecordingTileProps = $props();
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

		wavesurfer.load(url);

		return () => wavesurfer.destroy();
	});

	function togglePlay() {
		wavesurfer.playPause();
		isPlaying = !isPlaying;
	}
</script>

<button class="recording-wave" onclick={togglePlay} aria-label="Sound">
	<div bind:this={waveformContainer}></div>
</button>

<style>
	.recording-wave {
		appearance: none;
		background: none;
		border: none;
		width: 100%;
	}
</style>
