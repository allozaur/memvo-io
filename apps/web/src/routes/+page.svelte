<script lang="ts">
	import Recorder from '$lib/components/Recorder.svelte';
	import RecordingTile from '$lib/components/RecordingTile.svelte';
	import { onMount } from 'svelte';
	import base64ToBlob from '$lib/utils/base64-to-blob';
	import type { Transcription } from '$lib/types';
	import createRecording from '$lib/methods/create-recording';
	import { openDB } from 'idb';

	let db: any;

	let recordingUrl = $state('');

	let savedRecordings: {
		data: string;
		id: string;
		name: string;
		transcription?: Transcription;
	}[] = $state.raw([]);

	async function deleteRecordingFromDB(id: string) {
		const tx = db.transaction('recordings', 'readwrite');
		const store = tx.objectStore('recordings');

		await store.delete(id);
	}

	onMount(async () => {
		db = await openDB('MemvoDB', 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains('recordings')) {
					db.createObjectStore('recordings', {
						keyPath: 'id'
					});
				}
			}
		});

		const allRecordings = await db.getAll('recordings');

		savedRecordings = allRecordings || [];
	});

	$effect(() => {
		if (savedRecordings) {
			const tx = db?.transaction('recordings', 'readwrite');
			const store = tx?.objectStore('recordings');

			for (const recording of savedRecordings) {
				store.put(recording);
			}
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
		</div>

		<Recorder
			discardRecording={() => {
				URL.revokeObjectURL(recordingUrl);
				recordingUrl = '';
			}}
			saveRecording={async () => {
				if (!recordingUrl) return alert('No recording to save');

				const newRecording = await createRecording(recordingUrl);

				recordingUrl = '';

				savedRecordings = [newRecording, ...savedRecordings];
			}}
			bind:recordingUrl
		/>

		{#if savedRecordings.length > 0}
			<section class="recordings">
				<ul>
					{#each savedRecordings as recording ((recording.id, recording.transcription))}
						<li>
							<RecordingTile
								blob={base64ToBlob(recording.data)}
								deleteRecording={async () => {
									if (confirm('Are you sure you want to delete this recording?')) {
										savedRecordings = savedRecordings.filter((r) => r.id !== recording.id);

										await deleteRecordingFromDB(recording.id);
									}
								}}
								id={recording.id}
								name={recording.name}
								transcription={recording.transcription}
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
