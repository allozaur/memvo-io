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
		<rect x="6" y="4" width="4" height="16" />
		<rect x="14" y="4" width="4" height="16" />
	</svg>
</button>

<style>
	button {
		background: var(--c-surface-1);
		border: none;
		border-radius: 100%;
		color: var(--c-accent);
		cursor: pointer;
		font-size: 3rem;
		height: 3.5rem;
		padding: 0;
		width: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
