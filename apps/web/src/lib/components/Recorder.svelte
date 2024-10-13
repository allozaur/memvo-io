<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

	import Button from './Button.svelte';
	import ButtonPause from './ButtonPause.svelte';
	import ButtonPlay from './ButtonPlay.svelte';
	import ButtonRecord from './ButtonRecord.svelte';
	import ButtonStop from './ButtonStop.svelte';
	import formatProgressTime from '$lib/utils/format-progress-time';

	interface RecorderProps {
		discardRecording: () => void;
		recordingBlob?: Blob | MediaSource;
		recordingFileName?: string;
		recordingUrl?: string;
		saveRecording: () => void;
		scrollingWaveform?: boolean;
	}

	let {
		discardRecording,
		recordingUrl = $bindable(''),
		saveRecording,
		scrollingWaveform = true
	}: RecorderProps = $props();

	let defaultDeviceId: string | undefined = $state(undefined);
	let isPaused = $state(false);
	let isRecording = $state(false);
	let isStopped = $state(false);
	let progress = $state('00:00');
	let record: RecordPlugin = $state({} as RecordPlugin);
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

		wavesurfer.on('finish', () => {
			if (recordingUrl) {
				wavesurfer.load(recordingUrl);
			}
		});

		record = wavesurfer.registerPlugin(
			RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: true })
		);

		isStopped = true;

		record.on('record-end', (blob: Blob | MediaSource) => {
			recordingUrl = URL.createObjectURL(blob);
		});

		record.on('record-progress', (time: number) => {
			progress = formatProgressTime(time);

			if (time > 60000) {
				stopRecording();
			}
		});
	}

	function resetRecorder() {
		progress = '00:00';
		recordingUrl = '';
		wavesurfer.empty();
	}

	async function handleDiscardRecording() {
		if (!recordingUrl) {
			alert('No recording to discard');
			return;
		}

		discardRecording();
		resetRecorder();
	}

	async function handleSaveRecording() {
		if (!recordingUrl) {
			alert('No recording to save');
			return;
		}

		saveRecording();
		resetRecorder();
	}

	async function startPlayback() {
		wavesurfer.playPause();
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

	async function stopPlayback() {
		wavesurfer.stop();
		wavesurfer.load(recordingUrl);
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

	onMount(() => {
		createWaveSurfer();

		wavesurfer.empty();
	});
</script>

<div class="recorder">
	<div id="wave"></div>

	<div class="controls">
		{#if isRecording}
			<div class="inner">
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
			<div class="inner">
				<p class="progress-time">{progress}</p>

				{#if recordingUrl}
					<div class="controls">
						<ButtonPlay onclick={startPlayback} />

						<ButtonStop onclick={stopPlayback} />
					</div>

					<div class="recording-actions">
						<Button label="Save recording" onclick={handleSaveRecording} />

						<Button kind="danger" label="Discard recording" onclick={handleDiscardRecording} />
					</div>
				{:else}
					<ButtonRecord onclick={startRecording} />

					<span>Press to start recording</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	#wave {
		width: 100%;
		transition: all 0.2ms ease-out;
	}

	.controls {
		display: flex;
		gap: 0.75rem;
	}

	.inner {
		color: var(--c-text-light);
		display: grid;
		justify-items: center;
		gap: 1rem;
		width: 100%;
	}

	.recording-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
