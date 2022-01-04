<script lang="ts">
	import { style } from '../utils/style';
	import type { ElementProps } from '../utils/types';
	import { valueToPercent } from '../utils/value-percent';
	import { sliderSharedData } from './slider.store';

	export let element: HTMLDivElement;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	export let value: number;
	export let elementProps: ElementProps = {};

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

<style>
	[data-reach-slider-marker] {
		background: hsl(0, 0%, 50%);
		transform-origin: center;
		user-select: none;
	}

	[data-reach-slider-marker][data-orientation='horizontal'] {
		top: 50%;
		transform: translate(-50%, -50%);
		width: 3px;
		height: 0.75rem;
	}

	[data-reach-slider-marker][data-orientation='vertical'] {
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0.75rem;
		height: 3px;
	}
</style>
