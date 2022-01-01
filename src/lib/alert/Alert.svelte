<script lang="ts">
	import { waitFor } from '../utils/wait-for';
	import { VisuallyHidden } from '../visually-hidden';

	let politeRegion: HTMLDivElement;
	let assertiveRegion: HTMLDivElement;
</script>

<!-- {#await renderTimerPromise}
	{#each Object.entries(liveRegions) as [regionType, element]}
		{#if element}
			<VisuallyHidden>
				<div role={regionType === 'assertive' ? 'alert' : 'status'} aria-live={regionType}>
					
				</div>
			</VisuallyHidden>
		{/if}
	{/each}
{/await} -->

<!-- Regions -->
<VisuallyHidden>
	<div data-reach-live-polite="true" bind:this={politeRegion} />
	<div data-reach-live-assertive="true" bind:this={assertiveRegion} />
</VisuallyHidden>

{#await waitFor(500) then _}
	<VisuallyHidden />
{/await}
