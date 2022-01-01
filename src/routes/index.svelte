<script>
	import { rect } from '../lib';

	import { Alert } from '../lib/alert';
	import Slider from '../lib/slider/Slider.svelte';
	import '../lib/Slider/styles.css';
	let visible = false;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>
	<button on:click={() => (visible = !visible)}>Show </button>
</p>

<Slider handleAlignment="contain" />

{#if visible}
	<Alert>I am a alert</Alert>
{/if}

<div use:rect={{ onChange: console.log }} />
