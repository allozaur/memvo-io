<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import Button from './Button.svelte';
	import { browser } from '$app/environment';
	import transcribeRecording from '$lib/methods/transcribe-recording';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import type { Transcription } from '$lib/types';

	interface RecordingTileProps {
		blob: Blob;
		deleteRecording: () => void;
		id: string;
		name: string;
		savedRecordings?: any[];
		transcription?: Transcription;
	}

	let {
		blob,
		deleteRecording,
		id,
		name,
		savedRecordings = $bindable([]),
		transcription
	}: RecordingTileProps = $props();
	let isPlaying = $state(false);
	let isTranscribing = $state(false);

	const recordingUrl = URL.createObjectURL(blob);

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

		wavesurfer.load(recordingUrl);

		wavesurfer.on('play', () => {
			isPlaying = true;
		});

		wavesurfer.on('pause', () => {
			isPlaying = false;
		});

		wavesurfer.on('finish', () => {
			isPlaying = false;

			wavesurfer.load(recordingUrl);
		});
	}

	onMount(() => {
		createWaveSurfer();
	});
</script>

<div class="recording-tile" {id}>
	<h3>{name}</h3>

	<div bind:this={waveformContainer}></div>

	{#if transcription}
		<div class="transcription">
			<div class="inner">
				{transcription.text}
			</div>
		</div>
	{:else}
		<div class="transcribe-cta">
			{#if isTranscribing}
				<LoadingSpinner --size="1.5rem" />

				<span> Transcription in progress... </span>
			{:else}
				<span> You haven't transcribed this recording yet. </span>

				<Button
					kind="secondary"
					label="Transcribe"
					onclick={async () => {
						if (!savedRecordings) {
							return;
						}

						isTranscribing = true;

						const transcription = await transcribeRecording(blob);

						isTranscribing = false;

						savedRecordings = savedRecordings.map((rec) => {
							if (rec.id === id) {
								rec.transcription = transcription;
							}

							return rec;
						});
					}}
				/>
			{/if}
		</div>
	{/if}

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

		<Button kind="secondary" download={name} href={recordingUrl} label="Download"></Button>

		<Button kind="danger" onclick={async () => await deleteRecording()} label="Delete" />
	</div>
</div>

<style>
	.recording-tile {
		background: var(--bg-body-dark);
		color: var(--c-text);
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	h3 {
		padding: 1rem;
		justify-self: start;
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
		padding: 1rem;
		display: inline-grid;

		.inner {
			padding: 1rem;
			background: var(--bg-surface-3);
			display: inline-flex;
			margin-top: 1rem;
			font-size: 1.25rem;
			font-family: 'Crimson Text', serif;
			color: var(--c-text);
		}
	}

	.transcribe-cta {
		display: grid;
		padding: 1rem;
		gap: 1.25rem;
		place-items: center;
	}
</style>
