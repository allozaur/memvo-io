<script>
	const icons = import.meta.glob('../../../static/svg/brand/*.svg', {
		query: '?raw',
		import: 'default',
		eager: true
	});
</script>

<div class="logo" data-testid="icon" on:click on:keydown role="none">
	{@html icons[`../../../static/svg/brand/memvo-logo.svg`]}
</div>

<!-- <style>
	text {
		fill: var(--c-text) !important;
	}
</style> -->

<style lang="postcss">
	.logo {
		display: contents;
		font-size: var(--size, 2rem);
	}

	.logo :global(svg) {
		height: 1em;
		width: auto;
	}

	.logo :global(path) {
		fill: var(--c-text);
	}
</style>
