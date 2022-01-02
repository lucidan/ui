<script lang="ts">
	import { style } from '../utils/style';
	import { sliderSharedData } from './slider.store';

	export let element: HTMLDivElement = null;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	$: ({ disabled, orientation, rangeStyle } = $sliderSharedData);
</script>

<div
	bind:this={_element}
	style={style({ position: 'absolute', ...rangeStyle })}
	data-reach-slider-range=""
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
>
	<slot />
</div>

<style>
	:root {
		--reach-slider: 1;
	}

	[data-reach-slider-range] {
		border-radius: inherit;
		background: #1159a6;
		left: 0;
		bottom: 0;
		user-select: none;
	}

	[data-reach-slider-range][data-orientation='horizontal'] {
		height: 100%;
	}

	[data-reach-slider-range][data-orientation='vertical'] {
		width: 100%;
	}
</style>
