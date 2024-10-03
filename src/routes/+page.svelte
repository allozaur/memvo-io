<script>
	let audioUrl = $state('');

	/** @type {BlobPart[]} */
	let chunks = [];

	let isRecording = $state(false);

	/** @type {MediaRecorder | null} */
	let mediaRecorder = null;

	let recordingName = $state('');

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
				audioUrl = URL.createObjectURL(audioBlob);
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

		recordingName = `recording-${new Date().toISOString()}`;
	}
</script>

<main>
	{#if isRecording}
		<button class="stop" onclick={stopRecording}> ⏹</button>
	{:else}
		<button class="start" onclick={startRecording}>⏺</button>
	{/if}

	{#if audioUrl}
		<div class="recording">
			<audio controls src={audioUrl}></audio>

			<a href={audioUrl} download="{recordingName}.webm">Download Recording</a>
		</div>
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

	button {
		background: none;
		border: none;
		border-radius: 100%;
		font-size: 3rem;
		height: 3.5rem;
		width: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.start {
		background: #f0f0f0;
		color: red;
	}

	.stop {
		background: red;
		color: white;
	}

	.recording {
		display: grid;
		place-content: center;
		place-items: center;
		gap: 1rem;
	}
</style>
