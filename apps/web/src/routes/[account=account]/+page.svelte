<script>
	import { page } from '$app/stores';
	import RecordingTile from '$lib/components/RecordingTile.svelte';
</script>

<svelte:head>
	<title>My account | Memvo — Share or publish recordings with transcriptions</title>
</svelte:head>

<main>
	<h1>Hello, {$page.data?.session?.user?.user_metadata.name}</h1>

	<section>
		<h2>Your recordings</h2>

		<ul>
			{#each $page.data.recordings as { id, name, transcription, url }}
				<li>
					<RecordingTile {id} {name} {transcription} {url} recordings={$page.data.recordings} />
				</li>
			{/each}
		</ul>
	</section>
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
