<script lang="ts">
	import { sliderElements, sliderSharedData } from './slider.store';

	export let element: HTMLDivElement = null;
	let _element: HTMLDivElement;
	$: if (_element) $sliderElements.trackEl = element = _element;

	$: ({ disabled, orientation } = $sliderSharedData);
</script>

<div
	bind:this={_element}
	data-reach-slider-track=""
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
>
	<slot />
</div>
