<script>
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import '$lib/styles/index.css';
</script>

<Header hideMobile={$page.params.record !== undefined} />

<slot />
