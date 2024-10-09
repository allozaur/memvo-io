<script lang="ts">
	import Button from './Button.svelte';
	import Logo from './Logo.svelte';

	interface HeaderProps {
		hideMobile?: boolean;
	}

	const { hideMobile }: HeaderProps = $props();
</script>

<header class:hide-mobile={hideMobile}>
	<div class="left"></div>

	<div class="center">
		<a href="/">
			<Logo --size="1.125rem" />
		</a>
	</div>

	<div class="right">
		<Button label="Sign in" size="sm" />
	</div>
</header>

<style>
	header {
		height: 5rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		place-items: center;
	}

	.hide-mobile {
		@media (width < 768px) {
			display: none;
		}
	}
</style>
