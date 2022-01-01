<script lang="ts">
	import { portal } from '../portal';
	import { waitFor } from '../utils/wait-for';
	import { VisuallyHidden } from '../visually-hidden';

	export let type: 'polite' | 'assertive' = 'polite';

	let politeRegion: HTMLDivElement;
	let assertiveRegion: HTMLDivElement;
</script>

<!-- Actually rendered area -->
<div data-reach-alert><slot /></div>

<!-- Regions -->
<div use:portal>
	<VisuallyHidden>
		<div data-reach-live-polite="true" bind:this={politeRegion} />
		<div data-reach-live-assertive="true" bind:this={assertiveRegion} />
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
