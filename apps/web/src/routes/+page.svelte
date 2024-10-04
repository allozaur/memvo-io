<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Recorder from '$lib/components/Recorder/Recorder.svelte';
	import RecordingTile from '$lib/components/RecordingTile.svelte';

	let recordings: { id: string; name: string; url: string }[] = $state([]);
</script>

<main>
	<Logo --size="1.5rem" />

	<Recorder {recordings} />

	<div class="current">
		{#if recordings?.length}
			<RecordingTile name={recordings[0].name} url={recordings[0].url} {recordings} />
		{/if}
	</div>

	{#if recordings.length > 1}
		<section class="previous-recordings">
			<h2>Previous Recordings</h2>

			<ul>
				{#each recordings.slice(1) as { name, url }}
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
	}
</style>
