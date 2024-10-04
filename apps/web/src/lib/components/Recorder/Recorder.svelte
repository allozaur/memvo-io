<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
	import RecordButtonStart from '../RecordButtonStart.svelte';
	import RecordButtonStop from '../RecordButtonStop.svelte';
	import RecordButtonPause from '../RecordButtonPause.svelte';
	import { browser } from '$app/environment';
	// import { startRecording, stopRecording, togglePause } from './methods';

	interface RecorderProps {
		isPaused: boolean;
		isRecording: boolean;
		micSelect: HTMLSelectElement;
		recordings: { id: string; name: string; url: string }[];
		scrollingWaveform?: boolean;
	}

	let {
		isPaused = $bindable(),
		isRecording = $bindable(),
		micSelect,
		recordings,
		scrollingWaveform = true
	}: RecorderProps = $props();

	let waveColor = $state(
		browser && window.matchMedia('(prefers-color-scheme: dark)').matches
			? '#ffffff'
			: browser && window.matchMedia('(prefers-color-scheme: light)').matches
				? '#000000'
				: ''
	);

	let wavesurfer: WaveSurfer;
	let progress = $state('00:00');
	let record: any = $state();

	function createWaveSurfer() {
		if (wavesurfer) {
			wavesurfer.destroy();
		}

		wavesurfer = WaveSurfer.create({
			container: '#mic',
			waveColor,
			progressColor: 'rgb(100, 0, 100)'
		});

		record = wavesurfer.registerPlugin(
			RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: false })
		);

		record.on('record-end', (blob: Blob | MediaSource) => {
			recordings.push({
				name: new Date().toLocaleString(),
				id: crypto.randomUUID(),
				url: URL.createObjectURL(blob)
			});
		});

		record.on('record-progress', (time: number) => {
			updateProgress(time);
		});
	}

	function startRecording() {
		if (!micSelect.value) {
			alert('Choose a recording device!');
			return;
		}

		if (record.isRecording() || record.isPaused()) {
			record.stopRecording();

			return;
		}

		record.startRecording({ deviceId: micSelect.value }).then(() => {
			isRecording = true;
		});
	}

	function stopRecording() {
		record.stopRecording();
		isPaused = false;
		isRecording = false;
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

		RecordPlugin.getAvailableAudioDevices().then((devices) => {
			devices.forEach((device) => {
				const option = document.createElement('option');
				option.value = device.deviceId;
				option.text = device.label || device.deviceId;
				micSelect.appendChild(option);
			});
		});
	});
</script>

<select bind:this={micSelect}>
	<option value="" hidden>Select mic</option>
</select>

<p id="progress">{progress}</p>

<div id="mic"></div>

<div class="controls">
	{#if isRecording}
		<RecordButtonPause onclick={togglePause} />
		<RecordButtonStop onclick={stopRecording} />
	{:else if isPaused}
		<RecordButtonStop onclick={stopRecording} />
		<RecordButtonStart onclick={togglePause} />
	{:else}
		<RecordButtonStart onclick={startRecording} />
	{/if}
</div>

<style>
	.controls {
		display: flex;
		gap: 0.75rem;
	}

	#mic {
		width: 100%;
	}
</style>
