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
		<polygon points="4,3 4,21 20,12" fill="currentColor" />
	</svg>
</button>

<style>
	button {
		background: var(--bg-surface-1);
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
