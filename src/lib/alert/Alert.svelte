<script lang="ts">
	import { portal } from '../portal';
	import { waitFor } from '../utils/wait-for';
	import { VisuallyHidden } from '../visually-hidden';

	export let type: 'polite' | 'assertive' = 'polite';

	let politeRegion: HTMLDivElement;
	let assertiveRegion: HTMLDivElement;
</script>

<!-- Actually rendered area -->
<div data-lucidan-alert><slot /></div>

<!-- Regions -->
<div use:portal>
	<VisuallyHidden>
		<div data-lucidan-live-polite="true" bind:this={politeRegion} />
		<div data-lucidan-live-assertive="true" bind:this={assertiveRegion} />
	</VisuallyHidden>
</div>

{#await waitFor(500) then _}
	<div
		use:portal={type === 'assertive' ? assertiveRegion : politeRegion}
		role={type === 'assertive' ? 'alert' : 'status'}
		aria-live={type}
	>
		<slot />
	</div>
{/await}
