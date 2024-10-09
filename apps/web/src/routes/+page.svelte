<script>
	import Button from '$lib/components/Button.svelte';
</script>

<main>
	<div class="hero">
		<div class="text">
			<h1>
				Record, transcribe and publish.
				<br />
				<strong>It's that simple.</strong>
			</h1>

			<p>
				The easiest way to instantly get your ideas, interviews and conversations to Google Docs.
			</p>
		</div>

		<Button href="/record" label="Get started" />
	</div>
</main>

<style>
	.hero {
		display: grid;
		gap: 2.5rem;
		padding-block: 2.5rem;
		place-items: center;
		text-align: center;

		@media (width >= 768px) {
			padding-block: 4rem;
		}
	}

	.hero .text {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
	}

	.hero p {
		font-size: 1.125rem;
		line-height: 1.5;
	}

	h1 {
		font-size: 1.875rem;
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
