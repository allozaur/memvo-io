<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import RecordButton from '$lib/components/RecordButton.svelte';
	import RecordingTile from '$lib/components/RecordingTile.svelte';

	let chunks: BlobPart[] = [];

	let isRecording = $state(false);

	let mediaRecorder: MediaRecorder | null = null;

	let recordings: { id: string; name: string; url: string }[] = $state([]);

	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.ondataavailable = (event) => {
				chunks.push(event.data);
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(chunks, { type: 'audio/webm' });
				chunks = [];

				recordings = [
					{
						name: new Date().toLocaleString(),
						id: crypto.randomUUID(),
						url: URL.createObjectURL(audioBlob)
					},
					...recordings
				];
			};

			mediaRecorder.start();
			isRecording = true;
		} catch (error) {
			console.error('Error starting recording:', error);
		}
	}

	function stopRecording() {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;
		}
	}
</script>

<main>
	<Logo --height="4rem" />

	<h1>Say it out loud!</h1>

	<RecordButton {isRecording} onclick={isRecording ? stopRecording : startRecording} />

	<div class="current">
		{#if recordings?.length}
			<RecordingTile name={recordings[0].name} url={recordings[0].url} {recordings} />
		{/if}
	</div>

	{#if recordings.length > 1}
		<section class="previous-recordings">
			<h2>Previous Recordings</h2>

			<ul>
				{#each recordings.slice(1) as { name, url }}
					<li>
						<RecordingTile {name} {url} {recordings} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<style>
	main {
		display: grid;
		place-content: center;
		gap: 2rem;
		place-items: center;
		height: 100vh;
	}

	ul {
		list-style: none;
		padding: 0;
	}
</style>
