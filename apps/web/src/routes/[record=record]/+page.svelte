<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Recorder from '$lib/components/Recorder.svelte';
	import RecordingTile from '$lib/components/RecordingTile.svelte';

	async function deleteRecording(id: string, user_id: string, audio_file_name: string) {
		if (confirm('Are you sure you want to delete this recording?')) {
			const { error: storageRemoveError } = await $page.data.supabase.storage
				.from('user_recordings_audio_files')
				.remove([`${user_id}/${audio_file_name}`]);

			if (storageRemoveError) {
				console.error('Storage error:', storageRemoveError);
				return;
			}

			const { error: dbDeleteError } = await $page.data.supabase
				.from('user_recordings')
				.delete()
				.eq('id', id);

			if (dbDeleteError) {
				console.error('Database error:', dbDeleteError);
			} else {
				invalidate('get_user_recordings');
			}
		}
	}
</script>

<svelte:head>
	<title>Record | Memvo — Share or publish recordings with transcriptions</title>

	<meta
		name="description"
		content="Instant recordings 🔴 with transcriptions 📝 that you can publish 📤 to Google Docs."
	/>
</svelte:head>

<main>
	<Recorder />

	{#if $page.data.recordings?.length}
		<section class="recordings">
			<ul>
				{#each $page.data.recordings as { id, name, transcription, url, user_id } (id)}
					<li>
						<RecordingTile
							deleteRecording={async () => {
								const audio_file_name = new URL(url).pathname.split('/').pop();

								await deleteRecording(id, user_id, `${audio_file_name}`);
							}}
							{id}
							{name}
							{transcription}
							{url}
						/>
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
