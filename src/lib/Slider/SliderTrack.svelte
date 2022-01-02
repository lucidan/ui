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

<style>
	:root {
		--reach-slider: 1;
	}

	[data-reach-slider-track] {
		position: relative;
		border-radius: 0.25rem;
		background: hsl(0, 0%, 95%);
		user-select: none;
	}

	[data-reach-slider-track][data-orientation='horizontal'] {
		width: 100%;
		height: inherit;
	}

	[data-reach-slider-track][data-orientation='vertical'] {
		width: inherit;
		height: 100%;
	}

	/* This pseudo element provides an invisible area that increases the touch
target size of the track */
	[data-reach-slider-track]::before {
		content: '';
		position: absolute;
	}

	[data-reach-slider-track][data-orientation='horizontal']::before {
		width: 100%;
		height: 1.5rem;
		top: calc(-0.5rem - 1px);
		left: 0;
	}

	[data-reach-slider-track][data-orientation='vertical']::before {
		width: 1.5rem;
		height: 100%;
		top: 0;
		left: calc(-0.5rem - 1px);
	}
</style>
