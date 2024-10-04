<script>
	import '$lib/styles/index.css';

	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			console.log('Microphone permission granted');
		} catch (err) {
			console.error('Microphone permission denied', err);
		}
	});
</script>

<slot />
