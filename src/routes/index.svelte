<script>
	import Slider from '../lib/Slider/Slider.svelte';
	import '../lib/Slider/styles.css';

	let visible = true;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>
	<button on:click={() => (visible = !visible)}>Show </button>
</p>

<Slider />
