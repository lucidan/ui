<script>
	import { Alert, rect, Slider } from '../lib';
	import { disableScroll } from '../lib/utils/actions/disable-scroll';
	import { style } from '../lib/utils/style';

	let visible = false;

	let enabled = true;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>
	<button on:click={() => (visible = !visible)}>Show </button>
</p>

<p>
	<button on:click={() => (enabled = !enabled)}>toggle disable scroll </button>
</p>

<Slider handleAlignment="contain" />

{#if visible}
	<Alert>I am a alert</Alert>
{/if}

<div use:rect={{ onChange: console.log }} />

<div
	style={style({ height: '400px', width: '400px', backgroundColor: 'cyan', overflow: 'auto' })}
	use:disableScroll={{ enabled }}
>
	<!--  -->
</div>

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br
/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br
/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br
/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br
/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br
/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br
/><br /><br /><br />
