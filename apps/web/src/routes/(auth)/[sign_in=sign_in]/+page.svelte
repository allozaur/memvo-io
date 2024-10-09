<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button, PasswordInput, TextInput } from '@resider/design-system';
	import { t } from '@resider/i18n';
	import { onMount } from 'svelte';

	$: email = '';

	onMount(() => {
		email = $page.form?.email;
	});

	$: console.log($page.form);
</script>

{#if $page.url.hash === '#error=access_denied'}
	<mark style="max-width: 32rem">
		{$t(
			'global.To sign in with Google you need to click "Continue" on Google authentication screen.'
		)}
	</mark>
{:else if $page.form?.error === 'Invalid credentials'}
	<mark style="max-width: 32rem">
		{$t('global.Invalid credentials. Please check your email and password and try again.')}
	</mark>
{/if}

<form
	class="sign-in-form"
	action={$page?.form?.message.includes('not confirmed')
		? '?/resend_verification_link'
		: `?/email_signin&next=${encodeURIComponent(
				$page.url.searchParams.get('next') || `/${$page.params.lang}/${$t('slugs.account')}`
			)}`}
	method="POST"
	use:enhance
>
	<TextInput
		name="email"
		bind:value={email}
		placeholder={$t('global.Your e-mail address')}
		required
	/>

	{#if $page?.form?.message.includes('not confirmed')}
		<Button type="submit">{$t('global.Resend verification link')}</Button>
	{:else}
		{#key $page.form?.error}
			<PasswordInput name="password" placeholder={$t('global.Your password')} />
		{/key}

		<Button type="submit">{$t('global.Sign in')}</Button>

		<Button href="/{$page.params.lang}/{$t('slugs.reset-password')}" kind="ghost" type="submit">
			{$t(`global.I don't remember my password`)}
		</Button>

		<Button
			href="/{$page.params.lang}/{$t('slugs.sign-up')}{$page.url.searchParams.has('next')
				? `?next=${$page.url.searchParams.get('next')}`
				: ''}"
			kind="tertiary"
		>
			{$t(`global.I want to create an account`)}
		</Button>
	{/if}
</form>

<style>
	form {
		display: grid;
		gap: 1rem;
		max-width: 20rem;
		margin: 0 auto 1rem;
	}
</style>
