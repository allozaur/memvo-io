<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import Button from './Button.svelte';
	import { browser } from '$app/environment';

	interface RecordingTileProps {
		deleteRecording: () => Promise<void>;
		id: string;
		name: string;
		transcription?: string;
		url: string;
	}

	let { deleteRecording, id, name, url, transcription }: RecordingTileProps = $props();
	let isPlaying = $state(false);
	let waveformContainer: HTMLElement;
	let wavesurfer: WaveSurfer;
	let progressColor = $state(
		browser && window.matchMedia('(prefers-color-scheme: dark)').matches
			? '#ffffff'
			: browser && window.matchMedia('(prefers-color-scheme: light)').matches
				? '#000000'
				: ''
	);

	function createWaveSurfer() {
		if (wavesurfer) {
			wavesurfer.destroy(); // Clean up any previous instance
		}

		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: '#ccc',
			progressColor,
			cursorColor: progressColor,
			height: 100,
			barWidth: 2,
			barRadius: 3,
			backend: 'MediaElement' // Ensures browser-native audio handling
		});

		wavesurfer.load(url);

		wavesurfer.on('play', () => {
			isPlaying = true;
		});

		wavesurfer.on('pause', () => {
			isPlaying = false;
		});

		wavesurfer.on('finish', () => {
			isPlaying = false;
			// createWaveSurfer();

			wavesurfer.load(url);
		});
	}

	onMount(() => {
		createWaveSurfer(); // Initialize wavesurfer on component mount
	});
</script>

<div class="recording-tile" {id}>
	<h3>{name}</h3>

	<div bind:this={waveformContainer}></div>

	<div class="actions">
		<Button
			kind="primary"
			onclick={() => wavesurfer.playPause()}
			label={isPlaying ? 'Pause' : 'Play'}
		/>

		<Button
			kind="primary"
			onclick={() => {
				wavesurfer.stop();
				createWaveSurfer();
			}}
			label="Stop"
		/>

		<Button kind="secondary" download={name} href={url} label="Download"></Button>

		<Button kind="danger" onclick={async () => await deleteRecording()} label="Delete" />
	</div>

	{#if transcription}
		<div class="transcription">
			{transcription}
		</div>
	{/if}
</div>

<style>
	.recording-tile {
		background: var(--c-body-dark);
		color: var(--c-text);
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	h3 {
		padding: 1rem;
	}

	.actions {
		padding: 1rem;
		display: flex;
		gap: 1rem;

		@media (width < 768px) {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(max(10rem, calc((100vw - 4rem) / 3)), 1fr));

			:global(.button):first-child {
				grid-column: 1 / -1;
			}
		}
	}

	.transcription {
		display: inline-flex;
		padding: 1rem;
	}
</style>
