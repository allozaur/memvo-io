<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

	import Button from './Button.svelte';
	import ButtonPause from './ButtonPause.svelte';
	import ButtonPlay from './ButtonPlay.svelte';
	import ButtonRecord from './ButtonRecord.svelte';
	import ButtonStop from './ButtonStop.svelte';

	interface RecorderProps {
		scrollingWaveform?: boolean;
	}

	let { scrollingWaveform = true }: RecorderProps = $props();

	let defaultDeviceId: string | undefined = $state(undefined);
	let isPaused = $state(false);
	let isRecording = $state(false);
	let isStopped = $state(false);
	let progress = $state('00:00');
	let record: RecordPlugin = $state({} as RecordPlugin);
	let recordingUrl = $state('');
	let progressColor = $state(
		browser && window.matchMedia('(prefers-color-scheme: dark)').matches
			? '#ffffff'
			: browser && window.matchMedia('(prefers-color-scheme: light)').matches
				? '#000000'
				: ''
	);
	let wavesurfer: WaveSurfer;

	function createWaveSurfer() {
		if (wavesurfer) {
			wavesurfer.destroy();
		}

		wavesurfer = WaveSurfer.create({
			container: '#wave',
			waveColor: '#eee',
			progressColor,
			cursorColor: progressColor,
			height: 100,
			barWidth: 2,
			barRadius: 3,
			backend: 'MediaElement'
		});

		record = wavesurfer.registerPlugin(
			RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: true })
		);

		isStopped = true;

		record.on('record-end', (blob: Blob | MediaSource) => {
			recordingUrl = URL.createObjectURL(blob);
		});

		record.on('record-progress', (time: number) => {
			updateProgress(time);
		});
	}

	async function deleteRecording() {
		if (recordingUrl) {
			URL.revokeObjectURL(recordingUrl);
			recordingUrl = '';
			progress = '00:00';
			wavesurfer.empty();
		}
	}

	async function startPlayback() {
		wavesurfer.playPause();
	}

	async function stopPlayback() {
		wavesurfer.stop();
	}

	async function startRecording() {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			console.log('Microphone permission granted');
		} catch (err) {
			console.error('Microphone permission denied', err);
		}

		if (record.isRecording() || record.isPaused()) {
			record.stopRecording();
			return;
		}

		isStopped = false;

		const devices = await RecordPlugin.getAvailableAudioDevices();

		defaultDeviceId = devices.find((device) => device.kind === 'audioinput')?.deviceId;

		record.startRecording({ deviceId: defaultDeviceId }).then(() => {
			isRecording = true;
		});
	}

	function stopRecording() {
		record.stopRecording();

		isPaused = false;
		isRecording = false;
		isStopped = true;
	}

	function togglePause() {
		if (record.isPaused()) {
			isPaused = false;
			record.resumeRecording();
		} else {
			isPaused = true;
			record.pauseRecording();
		}
	}

	async function saveRecording() {
		if (recordingUrl) {
			const fileName = `${new Date().toISOString()}-${crypto.randomUUID()}.webm`;
			const response = await fetch(recordingUrl);
			const blob = await response.blob();
			const userId = $page.data.user?.id;

			if (!userId) {
				alert('You must be logged in to save recordings');
				return;
			}

			const { error: uploadError } = await $page.data.supabase.storage
				.from('user_recordings_audio_files')
				.upload(`${userId}/${fileName}`, blob, {
					contentType: 'audio/webm'
				});

			if (uploadError) {
				console.error('Error uploading file:', uploadError.message);
				return;
			}

			const transcription = 'Transcription text here';

			const { error: insertError } = await $page.data.supabase.from('user_recordings').insert([
				{
					id: crypto.randomUUID(),
					created_at: new Date().toISOString(),
					user_id: userId,
					audio_file_name: fileName,
					transcription: transcription
				}
			]);

			if (insertError) {
				console.error('Error inserting record into database:', insertError.message);
				return;
			}

			progress = '00:00';
			recordingUrl = '';
			wavesurfer.empty();

			await invalidate('get_user_recordings');
		}
	}

	function updateProgress(time: number) {
		const formattedTime = [
			Math.floor((time % 3600000) / 60000), // minutes
			Math.floor((time % 60000) / 1000) // seconds
		]
			.map((v) => (v < 10 ? '0' + v : v))
			.join(':');
		progress = formattedTime;
	}

	onMount(() => {
		createWaveSurfer();
		wavesurfer.empty();
	});
</script>

<div id="wave"></div>

<div class="controls">
	{#if isRecording}
		<div class="record">
			<p id="progress">{progress}</p>

			<div class="controls">
				{#if isPaused}
					<ButtonRecord onclick={togglePause} />
				{:else}
					<ButtonPause onclick={togglePause} />
				{/if}

				<ButtonStop onclick={stopRecording} />
			</div>
		</div>
	{:else if isStopped}
		<div class="record">
			<p id="progress">{progress}</p>
			{#if recordingUrl}
				<div class="controls">
					<ButtonPlay onclick={startPlayback} />

					<ButtonStop onclick={stopPlayback} />
				</div>

				<div class="recording-actions">
					<Button label="Save recording" onclick={saveRecording} />

					<Button kind="danger" label="Delete recording" onclick={deleteRecording} />
				</div>
			{:else}
				<ButtonRecord onclick={startRecording} />

				<span>Press to start recording</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.controls {
		display: flex;
		gap: 0.75rem;
	}

	.record {
		color: var(--c-text-light);
		display: grid;
		justify-items: center;
		gap: 1rem;
	}

	.recording-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	#wave {
		width: 100%;
		transition: all 0.2ms ease-out;
	}
</style>
