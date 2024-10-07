<script lang="ts">
	interface PlaybackRecordButtonProps {
		onclick: () => void;
	}

	let { onclick }: PlaybackRecordButtonProps = $props();
</script>

<button class="start" {onclick} aria-label="Record">
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="12" cy="12" r="12" fill="currentColor" />
	</svg>
</button>

<style>
	button {
		background: var(--c-surface);
		border: none;
		border-radius: 100%;
		color: var(--c-accent);
		cursor: pointer;
		padding: 0;
		font-size: 3rem;
		height: 3.5rem;
		width: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
