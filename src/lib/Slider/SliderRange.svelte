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
