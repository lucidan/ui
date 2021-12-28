<script lang="ts">
	import { style } from '../utils/style';
	import { valueToPercent } from '../utils/value-percent';
	import { sliderSharedData } from './slider.store';

	export let element: HTMLDivElement;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	export let value: number;
	export let elementProps: Omit<
		svelte.JSX.HTMLAttributes<HTMLDivElement>,
		keyof svelte.JSX.DOMAttributes<HTMLDivElement>
	> = {};

	$: ({
		disabled,
		isVertical,
		orientation,
		sliderMin,
		sliderMax,
		value: sliderValue,
	} = $sliderSharedData);

	$: inRange = !(value < sliderMin || value > sliderMax);
	$: absoluteStartPosition = `${valueToPercent(value, sliderMin, sliderMax)}%`;
	$: state =
		value < sliderValue ? 'under-value' : value === sliderValue ? 'at-value' : 'over-value';
</script>

{#if inRange}
	<div
		{...elementProps}
		bind:this={_element}
		style={style({
			position: 'absolute',
			...(isVertical ? { bottom: absoluteStartPosition } : { left: absoluteStartPosition }),
		})}
		data-reach-slider-marker=""
		data-disabled={disabled ? '' : undefined}
		data-orientation={orientation}
		data-state={state}
		data-value={value}
	>
		<slot />
	</div>
{/if}
