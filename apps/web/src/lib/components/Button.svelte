<script lang="ts">
	interface ButtonProps {
		download?: string;
		href?: string;
		onclick?: () => void;
		label: string;
		kind?: 'primary' | 'secondary';
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
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 0.75rem;
		text-decoration: none;
	}

	.primary {
		background-color: #403a35;
		color: #eee;
	}

	.secondary {
		background-color: #9a9fa4;
		color: white;
	}
</style>
