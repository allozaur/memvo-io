<script>
	import { afterNavigate, invalidate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import '$lib/styles/index.css';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';

	export let data;

	$: ({ session, supabase } = data);

	afterNavigate(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{#snippet rightContent()}
	{#if $page.data.session}
		{#if $page.params.account}
			<Button href="/sign-out" kind="danger" label="Sign out" size="sm" />
		{:else}
			<Button href="/account" kind="secondary" label="My account" size="sm" />
		{/if}
	{:else}
		{#snippet leftIcon()}
			<Logo name="google" --size="1.25rem" />
		{/snippet}
	{/if}
{/snippet}

<Header hideMobile={$page.params.record !== undefined} {rightContent} />

<slot />
