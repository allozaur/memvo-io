<script lang="ts">
	interface RecordButtonProps {
		isRecording: boolean;
		onclick: () => void;
	}

	let { isRecording, onclick }: RecordButtonProps = $props();
</script>

{#if isRecording}
	<button class="stop" {onclick}> ⏹</button>
{:else}
	<button class="start" {onclick}>⏺</button>
{/if}

<style>
	button {
		background: none;
		border: none;
		border-radius: 100%;
		cursor: pointer;
		font-size: 3rem;
		height: 3.5rem;
		width: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.start {
		background: var(--c-surface);
		color: var(--c-accent);
	}

	.stop {
		background: var(--c-accent);
		color: white;
	}
</style>
