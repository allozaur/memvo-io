<script lang="ts">
	interface LogoProps {
		name?: string;
	}

	const icons = import.meta.glob('../../../static/svg/logos/*.svg', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	let { name = 'memvo' }: LogoProps = $props();
</script>

<div class="logo" data-testid="icon" role="none">
	{@html icons[`../../../static/svg/logos/${name}.svg`]}
</div>

<style lang="postcss">
	.logo {
		display: contents;
		font-size: var(--size, 2rem);
	}

	.logo :global(svg) {
		height: 1em;
		width: auto;
	}
</style>
