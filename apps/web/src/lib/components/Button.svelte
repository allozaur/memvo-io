<script lang="ts">
	interface ButtonProps {
		download?: string;
		href?: string;
		onclick?: () => void;
		label: string;
		kind?: 'primary' | 'secondary' | 'danger';
	}

	let { download, href, kind = 'primary', label, onclick }: ButtonProps = $props();
</script>

{#snippet inner()}
	{label}
{/snippet}

{#if href}
	<a class="button {kind}" {download} {href} {onclick}>
		{@render inner()}
	</a>
{:else}
	<button class="button {kind}" {onclick}>
		{@render inner()}
	</button>
{/if}

<style>
	.button {
		cursor: pointer;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 1.5rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 0.75rem 1.25rem;
		text-decoration: none;
		font-weight: 600;
	}

	.primary {
		background-color: var(--c-surface-2);
		color: var(--c-text);
	}

	.danger {
		background-color: var(--bg-error);
		color: var(--c-error);
	}

	.secondary {
		background-color: var(--c-surface-1);
		color: var(--c-text);
	}
</style>
