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
		padding-block: 2.5rem;
		place-items: center;
		text-align: center;

		@media (width >= 768px) {
			padding-block: 4rem;
		}
	}

	h1 {
		font-size: 2rem;
		line-height: 1.5;
		font-weight: 600;
		margin: 0;

		@media (width < 768px) {
			br {
				display: none;
			}
		}
		@media (width >= 768px) {
			font-size: 2.5rem;
		}
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
