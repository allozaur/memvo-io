<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import { browser } from '$app/environment';
	import type { RecordingWaveProps } from './RecordingWave.d.ts';
	import base64ToBlob from '$lib/utils/base64-to-blob.js';

	let { data, wavesurfer = $bindable() }: RecordingWaveProps = $props();

	let progressColor = $state(
		browser && window.matchMedia('(prefers-color-scheme: dark)').matches
			? '#ffffff'
			: browser && window.matchMedia('(prefers-color-scheme: light)').matches
				? '#000000'
				: ''
	);

	let recordingUrl = $state(URL.createObjectURL(base64ToBlob(data)));

	let waveformContainer: HTMLElement;

	onMount(() => {
		if (wavesurfer) {
			wavesurfer.destroy();
		}

		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: '#ccc',
			progressColor,
			cursorColor: progressColor,
			height: 100,
			barWidth: 2,
			barRadius: 3,
			backend: 'MediaElement'
		});

		wavesurfer.load(recordingUrl);

		wavesurfer.on('finish', () => {
			wavesurfer?.load(recordingUrl);
		});
	});
</script>

<div class="recording-wave" bind:this={waveformContainer}></div>
