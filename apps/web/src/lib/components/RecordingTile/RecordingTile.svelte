<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import Button from '../Button.svelte';
	import transcribeRecording from '$lib/methods/transcribe-recording';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import type { RecordingTileProps } from './types';
	import RecordingWave from '$lib/components/RecordingWave/RecordingWave.svelte';
	import base64ToBlob from '$lib/utils/base64-to-blob';

	let {
		data,
		deleteRecording,
		id,
		name,
		savedRecordings = $bindable([]),
		titleSlot,
		transcription
	}: RecordingTileProps = $props();

	let blob: Blob = $state(base64ToBlob(data));

	let isPlaying = $state(false);

	let isTranscribing = $state(false);

	let recordingUrl = $state(URL.createObjectURL(blob));

	let wavesurfer: WaveSurfer | undefined = $state(undefined);

	let currentTime = $state(0);

	onMount(() => {
		if (wavesurfer) {
			wavesurfer.on('play', () => {
				isPlaying = true;
			});

			wavesurfer.on('pause', () => {
				isPlaying = false;
			});

			wavesurfer.on('finish', () => {
				isPlaying = false;
			});

			wavesurfer.on('timeupdate', () => {
				currentTime = wavesurfer?.getCurrentTime() || 0;
			});

			wavesurfer.on('audioprocess', () => {
				currentTime = wavesurfer?.getCurrentTime() || 0;
			});
		}
	});

	function playFromTime(start: number) {
		if (wavesurfer) {
			currentTime = start;
			wavesurfer.setTime(currentTime);
			wavesurfer.play();
		}
	}
</script>

<div class="recording-tile" {id}>
	{#if titleSlot}
		<h3>
			{@render titleSlot()}
		</h3>
	{:else if name}
		<h3>
			{name}
		</h3>
	{/if}

	<RecordingWave {data} bind:wavesurfer />

	{#if transcription?.words?.length}
		<div class="transcription">
			<div class="inner">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				{#each transcription.words as { word, start, end }, i}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						class="word-wrapper"
						data-start={start}
						data-end={end}
						class:highlight={currentTime >= start && currentTime <= end}
						class:read={currentTime >= start}
						onclick={() => playFromTime(start)}
					>
						{#if i !== transcription.words.length - 1}
							<span class="word">{word}</span>&nbsp;
						{:else}
							<span class="word">{word}</span>
						{/if}
					</span>
				{/each}
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
			onclick={() => wavesurfer?.playPause()}
			label={isPlaying ? 'Pause' : 'Play'}
		/>

		<Button
			kind="primary"
			onclick={() => {
				wavesurfer?.stop();
			}}
			label="Stop"
		/>

		<Button kind="secondary" download={name} href={recordingUrl} label="Download"></Button>

		{#if deleteRecording}
			<Button kind="danger" onclick={() => deleteRecording()} label="Delete" />
		{/if}
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

	.word {
		color: var(--c-text-light);
		cursor: pointer;

		.read & {
			color: var(--c-text);
		}

		.highlight & {
			color: black;
			background-color: yellow;
		}
	}
</style>
