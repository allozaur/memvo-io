<script>
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
	import '$lib/styles/index.css';
</script>

<header class:hide-mobile={$page.params.record}>
	<a href="/">
		<Logo --size="1.125rem" />
	</a>
</header>

<slot />

<style>
	header {
		height: 5rem;
		display: grid;
		place-items: center;
	}

	.hide-mobile {
		@media (width < 768px) {
			display: none;
		}
	}
</style>
