<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Recorder from '$lib/components/Recorder.svelte';
	import RecordingTile from '$lib/components/RecordingTile.svelte';

	let recordings: { id: string; name: string; url: string }[] = $state([]);
</script>

<main>
	<Recorder {recordings} />

	{#if recordings.length}
		<section class="recordings">
			<ul>
				{#each recordings as { name, url }}
					<li>
						<RecordingTile {name} {url} {recordings} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<style>
	main {
		display: grid;
		place-content: start stretch;
		gap: 3rem;
		place-items: center;
		padding-top: 2rem;
	}

	ul {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 1.5rem;
	}

	.recordings {
		justify-self: stretch;
		width: 100%;
		margin: auto;
	}
</style>
