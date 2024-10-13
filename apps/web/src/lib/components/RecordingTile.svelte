<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import Button from './Button.svelte';
	import { browser } from '$app/environment';

	interface RecordingTileProps {
		blob: Blob;
		deleteRecording: () => Promise<void>;
		id: string;
		name: string;
		transcription?: string;
		url: string;
	}

	let { blob, deleteRecording, id, name, url, transcription }: RecordingTileProps = $props();
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

			wavesurfer.load(url);
		});
	}

	async function transcribeRecording(audioBlob: Blob): Promise<{ text: string } | null> {
		try {
			const formData = new FormData();
			const newBlob = new Blob([audioBlob], { type: 'audio/webm' });
			formData.append('audio', newBlob, 'audio.webm');

			const response = await fetch('/api/transcribe', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Error in transcription request');
			}

			const result = await response.json();

			return result;
		} catch (error) {
			console.error('Error fetching transcription:', error);
			return null;
		}
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
				{transcription}
			</div>
		</div>
	{:else}
		<div class="transcribe-cta">
			<span> You haven't transcribed this recording yet. </span>

			<Button
				kind="secondary"
				label="Transcribe"
				onclick={async () => {
					const transcriptionResult = await transcribeRecording(blob);
					transcription = transcriptionResult ? transcriptionResult.text : '';
				}}
			/>
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

		<Button kind="secondary" download={name} href={url} label="Download"></Button>

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
		gap: 1rem;
		place-items: center;
	}
</style>
