<script>
	import { fade } from 'svelte/transition';

	export let delay = 600;
</script>

<div class="loading-spinner" in:fade={{ duration: 100, delay }} out:fade={{ duration: 100 }}>
	<div />
	<div />
</div>

<style>
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-spinner {
		--loading-spinner-border-width: 3px;
		display: inline-block;
		position: relative;
		width: var(--size, 2rem);
		height: var(--size, 2rem);
	}

	.loading-spinner div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: var(--size);
		height: var(--size);
		border: var(--loading-spinner-border-width) solid var(--c-text);
		border-radius: 50%;
		animation: rotate 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: var(--c-text) transparent transparent transparent;
	}

	.loading-spinner:nth-child(1) {
		animation-delay: -0.375s;
	}
</style>
