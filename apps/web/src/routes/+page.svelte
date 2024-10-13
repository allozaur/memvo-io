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
		data: string; // Base64 data for storage
	}[] = $state.raw([]);

	async function deleteRecording() {
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

		const newRecording = {
			id: recordingFileName,
			name: recordingFileName,
			data: base64Data,
			transcription: '',
			url: URL.createObjectURL(recordingBlob)
		};

		savedRecordings = [newRecording, ...savedRecordings];

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

	function deleteSavedRecording(id: string) {
		if (confirm('Are you sure you want to delete this recording?')) {
			const recordingIndex = savedRecordings.findIndex((rec) => rec.id === id);
			if (recordingIndex !== -1) {
				const recording = savedRecordings[recordingIndex];
				URL.revokeObjectURL(recording.url);

				savedRecordings.splice(recordingIndex, 1);

				savedRecordings = savedRecordings.filter((rec) => rec.id !== id);

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
		}
	}

	onMount(() => {
		const savedData = localStorage.getItem('savedRecordings');

		if (savedData) {
			const recordings = JSON.parse(savedData);
			savedRecordings = recordings.map(
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
</script>

<svelte:head>
	<title>Memvo — Share or publish recordings with transcriptions</title>

	<meta
		name="description"
		content="Instant recordings 🔴 with transcriptions 📝 that you can publish 📤 to Google Docs."
	/>
</svelte:head>

<main>
	<div class="hero">
		<div class="text">
			<h1>
				Record, transcribe and publish.
				<br />
				<strong>It's that simple.</strong>
			</h1>

			<p>
				The easiest way to instantly get your ideas, interviews and conversations to Google Docs.
			</p>
		</div>

		<Recorder
			{deleteRecording}
			bind:recordingBlob
			bind:recordingFileName
			bind:recordingUrl
			{saveRecording}
		/>

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
								deleteRecording={async () => await deleteSavedRecording(recording.id)}
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
		gap: 2.5rem;
		padding-block: 2.5rem;
		place-items: center;
		text-align: center;

		@media (width >= 768px) {
			padding-block: 4rem;
		}
	}

	.hero .text {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		margin-bottom: 3rem;
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
