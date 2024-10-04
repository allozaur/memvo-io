<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
	import RecordButtonStart from './RecordButtonStart.svelte';
	import RecordButtonStop from './RecordButtonStop.svelte';
	import RecordButtonPause from './RecordButtonPause.svelte';
	import { browser } from '$app/environment';

	interface RecorderProps {
		isPaused: boolean;
		isRecording: boolean;
		micSelect: HTMLSelectElement;
		recordings: { id: string; name: string; url: string }[];
		scrollingWaveform?: boolean;
	}

	let waveColor = $state(
		browser && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ffffff' : '#000000'
	);

	let {
		isPaused,
		isRecording,
		micSelect,
		recordings,
		scrollingWaveform = true
	}: RecorderProps = $props();

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

	function updateProgress(time: number) {
		const formattedTime = [
			Math.floor((time % 3600000) / 60000), // minutes
			Math.floor((time % 60000) / 1000) // seconds
		]
			.map((v) => (v < 10 ? '0' + v : v))
			.join(':');
		progress = formattedTime;
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

	function startRecording() {
		if (record.isRecording() || record.isPaused()) {
			record.stopRecording();

			return;
		}

		const deviceId = micSelect.value;
		record.startRecording({ deviceId }).then(() => {
			isRecording = true;
		});
	}

	function stopRecording() {
		record.stopRecording();
		isPaused = false;
		isRecording = false;
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

<!-- <label style="display:inline-block;">
	<input type="checkbox" checked={scrollingWaveform} onchange={handleCheckboxChange} /> Scrolling waveform
</label> -->

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
