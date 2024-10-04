<script lang="ts">
	import Button from './Button.svelte';

	interface RecordingTileProps {
		name: string;
		url: string;
		recordings: { name: string; url: string }[];
	}

	let { name, url, recordings }: RecordingTileProps = $props();
</script>

<div class="recording-tile">
	<h3>{name}</h3>

	<div>
		<audio controls src={url}></audio>
	</div>

	<Button download="{name}.webm" href={url} label="Download"></Button>

	<Button
		kind="secondary"
		onclick={() => {
			if (confirm('Do you want to delete this recording?')) {
				recordings.splice(
					recordings.findIndex((r) => r.name === name),
					1
				);
			}
		}}
		label="Delete"
	/>
</div>

<style>
	.recording-tile {
		border: 1px solid #ccc;
		border-radius: 1.25rem;
		background: #f4f4f4;
		padding: 1rem;
		display: grid;
		gap: 1rem;
		align-items: start;
	}
</style>
