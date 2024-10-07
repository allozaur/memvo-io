<script lang="ts">
	interface RecordButtonProps {
		onclick: () => void;
	}

	let { onclick }: RecordButtonProps = $props();
</script>

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

<style>
	button {
		background: var(--c-accent);
		border: none;
		border-radius: 100%;
		color: white;
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
