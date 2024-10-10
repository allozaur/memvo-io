<script lang="ts">
	import type { Snippet } from 'svelte';
	import Logo from './Logo.svelte';

	interface HeaderProps {
		hideMobile?: boolean;
		rightContent?: Snippet;
	}

	let { hideMobile, rightContent }: HeaderProps = $props();
</script>

<header class:hide-mobile={hideMobile}>
	<div class="left">
		<span>&nbsp;</span>
	</div>

	<div class="center">
		<a class="header-logo" href="/">
			<Logo --size="1.125rem" />
		</a>
	</div>

	<div class="right">
		{#if rightContent}
			{@render rightContent()}
		{/if}
	</div>
</header>

<style>
	header {
		height: 5rem;
		display: grid;
		align-items: center;
		padding-inline: 1rem;

		@media (width >= 768px) {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	.hide-mobile {
		@media (width < 768px) {
			display: none;
		}
	}

	.center {
		justify-self: center;
	}

	.right {
		justify-self: end;
	}

	.left,
	.right {
		@media (width < 768px) {
			display: none;
		}
	}

	.header-logo :global(path) {
		fill: var(--c-text);
	}
</style>
