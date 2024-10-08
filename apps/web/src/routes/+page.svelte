<script>
	import Button from '$lib/components/Button.svelte';
</script>

<main>
	<div class="hero">
		<h1>
			Record, transcribe and share.
			<br />
			<strong>It's that simple.</strong>
		</h1>

		<Button href="/record" label="Get started" />
	</div>
</main>

<style>
	.hero {
		display: grid;
		gap: 3.5rem;
		padding-block: 4rem;
		place-items: center;
		text-align: center;
	}

	h1 {
		font-size: 2.5rem;
		line-height: 1.5;
		font-weight: 600;
	}

	strong {
		color: var(--c-accent);
		font-weight: 600;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 3rem;
		}
	}
</style>
