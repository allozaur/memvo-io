<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ButtonProps {
		download?: string;
		href?: string;
		onclick?: () => void;
		label: string;
		leftIcon?: Snippet;
		kind?: 'primary' | 'secondary' | 'danger';
		rightIcon?: Snippet;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	}

	let {
		download,
		href,
		kind = 'primary',
		label,
		leftIcon,
		onclick,
		rightIcon,
		size = 'md'
	}: ButtonProps = $props();
</script>

{#snippet inner()}
	{label}
{/snippet}

{#if href}
	<a class="button {kind} {size}" {download} {href} {onclick}>
		{#if leftIcon}
			{@render leftIcon()}
		{/if}

		{@render inner()}

		{#if rightIcon}
			{@render rightIcon()}
		{/if}
	</a>
{:else}
	<button class="button {kind} {size}" {onclick}>
		{#if leftIcon}
			{@render leftIcon()}
		{/if}
		{@render inner()}
		{#if rightIcon}
			{@render rightIcon()}
		{/if}
	</button>
{/if}

<style>
	.button {
		background: var(--background, var(--background-preset));
		cursor: pointer;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		display: inline-flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		font-weight: 600;
	}

	.xs {
		border-radius: 0.75rem;
		padding: 0.25rem 0.5rem;
	}

	.sm {
		border-radius: 1.25rem;
		padding: 0.5rem 1rem;
	}

	.md {
		border-radius: 1.5rem;
		padding: 0.75rem 1.25rem;
	}

	.lg {
		border-radius: 2rem;
		padding: 1rem 1.5rem;
	}

	.xl {
		border-radius: 2.5rem;
		padding: 1.25rem 2rem;
	}

	.primary {
		--background-preset: var(--c-surface-2);
		color: var(--c-text);
	}

	.danger {
		--background-preset: var(--bg-error);
		color: var(--c-error);
	}

	.secondary {
		--background-preset: var(--c-surface-1);
		color: var(--c-text);
	}
</style>
