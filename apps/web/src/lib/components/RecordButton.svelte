<script lang="ts">
	interface RecordButtonProps {
		isRecording: boolean;
		onclick: () => void;
	}

	let { isRecording, onclick }: RecordButtonProps = $props();
</script>

{#if isRecording}
	<button class="stop" {onclick} aria-label="Stop">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="1" y="1" width="22" height="22" />
		</svg>
	</button>
{:else}
	<button class="start" {onclick} aria-label="Record">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="12" />
		</svg>
	</button>
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
