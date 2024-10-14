<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>My account | Memvo — Share or publish recordings with transcriptions</title>
</svelte:head>

<main>
	<h1>Hello, {$page.data?.session?.user?.user_metadata.name}</h1>
</main>

<style>
	main {
		max-width: 60rem;
		margin: auto;
		display: grid;
		gap: 2rem;
		justify-items: start;
	}
</style>
