<script>
	import Logo from '$lib/components/Logo.svelte';
	import '$lib/styles/index.css';
</script>

<header>
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
</style>
