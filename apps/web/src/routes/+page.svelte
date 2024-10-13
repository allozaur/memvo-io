<script lang="ts">
	import Recorder from '$lib/components/Recorder.svelte';
	import RecordingTile from '$lib/components/RecordingTile.svelte';
	import { onMount } from 'svelte';
	import base64ToBlob from '$lib/utils/base64-to-blob';
	import blobToBase64 from '$lib/utils/blob-to-base64';

	let recordingBlob: Blob | MediaSource | undefined = $state();
	let recordingFileName = $state('');
	let recordingUrl = $state('');

	let savedRecordings: {
		id: string;
		name: string;
		url: string;
		transcription?: string;
		data: string;
	}[] = $state.raw([]);

	async function discardRecording() {
		if (!recordingUrl) return alert('No recording to delete');

		URL.revokeObjectURL(recordingUrl);
		recordingUrl = '';
	}

	async function saveRecording() {
		if (!recordingUrl) return alert('No recording to save');

		const response = await fetch(recordingUrl);
		recordingBlob = await response.blob();
		recordingFileName = `${new Date().toISOString()}-${crypto.randomUUID()}.webm`;
		recordingUrl = '';

		const base64Data = await blobToBase64(recordingBlob);

		savedRecordings = [
			{
				id: recordingFileName,
				name: recordingFileName,
				data: base64Data,
				transcription: '',
				url: URL.createObjectURL(recordingBlob)
			},
			...savedRecordings
		];
	}

	function deleteRecording(id: string) {
		if (confirm('Are you sure you want to delete this recording?')) {
			savedRecordings = savedRecordings.filter((rec) => rec.id !== id);
		}
	}

	onMount(() => {
		if (localStorage.getItem('savedRecordings')) {
			savedRecordings = JSON.parse(`${localStorage.getItem('savedRecordings')}`).map(
				(rec: { id: string; name: string; data: string; transcription?: string }) => {
					const blob = base64ToBlob(rec.data);
					const url = URL.createObjectURL(blob);
					return {
						id: rec.id,
						name: rec.name,
						data: rec.data,
						transcription: rec.transcription,
						url
					};
				}
			);
		}
	});

	$effect(() => {
		if (savedRecordings) {
			console.log('savedRecordings:', savedRecordings);

			localStorage.setItem(
				'savedRecordings',
				JSON.stringify(
					savedRecordings.map(({ id, name, data, transcription }) => ({
						id,
						name,
						data,
						transcription
					}))
				)
			);
		}
	});
</script>

<svelte:head>
	<title>Memvo — Easily share recordings with transcriptions</title>

	<meta
		name="description"
		content="Instant recordings 🔴 with transcriptions 📝 that you can share 📤."
	/>
</svelte:head>

<main>
	<div class="hero">
		<div class="text">
			<h1>
				Record, transcribe and share.
				<br />
				<strong>It's that simple.</strong>
			</h1>

			<!-- <p>
				The easiest way to instantly get your ideas, interviews and conversations to Google Docs.
			</p> -->
		</div>

		<Recorder {discardRecording} bind:recordingUrl {saveRecording} />

		{#if savedRecordings.length > 0}
			<section class="recordings">
				<ul>
					{#each savedRecordings as recording (recording.id)}
						<li>
							<RecordingTile
								blob={base64ToBlob(recording.data)}
								id={recording.id}
								name={recording.name}
								url={recording.url}
								transcription={recording.transcription}
								deleteRecording={() => deleteRecording(recording.id)}
								bind:savedRecordings
							/>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
</main>

<style>
	.hero {
		display: grid;
		gap: 4rem;
		padding-block: 2.5rem;
		text-align: center;

		@media (width >= 768px) {
			padding-block: 4rem;
		}
	}

	.hero .text {
		display: grid;
		padding: 0 1rem;
		gap: 0.5rem;
		place-self: center;

		@media (width >= 768px) {
			gap: 1rem;
			margin-bottom: 3rem;
			padding: 1.5rem;
		}
	}

	.hero p {
		font-size: 1.125rem;
		line-height: 1.5;
	}

	h1 {
		font-size: 1.875rem;
		line-height: 1.5;
		font-weight: 600;
		margin: 0;

		@media (width < 768px) {
			br {
				display: none;
			}
		}
		@media (width >= 768px) {
			font-size: 2.5rem;
		}
	}

	strong {
		color: var(--c-accent);
		font-weight: 600;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 3rem;
		}
	}

	ul {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 1.5rem;
	}

	.recordings {
		justify-self: stretch;
		width: 100%;
		margin: auto;
	}
</style>
