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
	data-lucidan-slider-range=""
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
>
	<slot />
</div>

<style>
	[data-lucidan-slider-range] {
		border-radius: inherit;
		background: #1159a6;
		left: 0;
		bottom: 0;
		user-select: none;
	}

	[data-lucidan-slider-range][data-orientation='horizontal'] {
		height: 100%;
	}

	[data-lucidan-slider-range][data-orientation='vertical'] {
		width: 100%;
	}
</style>
