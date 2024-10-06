<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
	import RecordButtonStart from '../RecordButtonStart.svelte';
	import RecordButtonStop from '../RecordButtonStop.svelte';
	import RecordButtonPause from '../RecordButtonPause.svelte';
	import { browser } from '$app/environment';
	import Button from '../Button.svelte';
	import RecordButtonPlay from '../RecordButtonPlay.svelte';

	interface RecorderProps {
		recordings: { id: string; name: string; url: string }[];
		scrollingWaveform?: boolean;
	}

	let { recordings, scrollingWaveform = true }: RecorderProps = $props();

	let defaultDeviceId: string | undefined = $state(undefined);
	let isPaused = $state(false);
	let isRecording = $state(false);
	let isStopped = $state(false);
	let progress = $state('00:00');
	let record: RecordPlugin = $state({} as RecordPlugin);
	let recordingUrl = $state('');
	let waveColor = $state(
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
			waveColor,
			progressColor: '#ddd',
			cursorColor: '#ddd',
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

	function saveRecording() {
		if (recordingUrl) {
			recordings.push({
				name: new Date().toLocaleString(),
				id: crypto.randomUUID(),
				url: recordingUrl
			});

			progress = '00:00';

			recordingUrl = '';
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

	onMount(async () => {
		createWaveSurfer();

		const devices = await RecordPlugin.getAvailableAudioDevices();

		defaultDeviceId = devices.find((device) => device.kind === 'audioinput')?.deviceId;
	});
</script>

<div class:visible={isRecording || isPaused || recordingUrl} id="wave"></div>

<div class="controls">
	{#if isRecording}
		{#if isPaused}
			<RecordButtonStart onclick={togglePause} />
		{:else}
			<RecordButtonPause onclick={togglePause} />
		{/if}

		<RecordButtonStop onclick={stopRecording} />
	{:else if isPaused}
		<RecordButtonStop onclick={stopRecording} />
		<RecordButtonStart onclick={togglePause} />
	{:else if isStopped}
		<div class="record">
			<p id="progress">{progress}</p>

			{#if recordingUrl}
				<div class="controls">
					<RecordButtonPlay onclick={startPlayback} />

					<RecordButtonStop onclick={stopPlayback} />
				</div>

				<div class="recording-actions">
					<Button label="Save recording" onclick={saveRecording} />
					<Button label="Delete recording" onclick={deleteRecording} />
				</div>
			{:else}
				<RecordButtonStart onclick={startRecording} />

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

		&:not(.visible) {
			opacity: 0;
			height: 0;
		}
	}
</style>
