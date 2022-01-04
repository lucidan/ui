<script lang="ts">
	import { style } from '../utils/style';
	import { composeEventHandlers } from '../utils/compose-event-handler';
	import { sliderCallbacks, sliderElements, sliderSharedData } from './slider.store';
	import type { ElementProps } from '../utils/types';

	export let element: HTMLDivElement = null;
	let _element: HTMLDivElement;
	$: if (_element) $sliderElements.handleEl = element = _element;

	export let onBlur: (event: FocusEvent) => void = null;
	export let onFocus: (event: FocusEvent) => void = null;
	export let onKeyDown: (event: KeyboardEvent) => void = null;
	export let elementProps: ElementProps = {};

	$: ({
		ariaLabel,
		ariaLabelledBy,
		ariaValueText,
		disabled,
		handlePosition,
		isVertical,
		orientation,
		sliderMin,
		sliderMax,
		value,
	} = $sliderSharedData);

	$: ({ handleKeyDown } = $sliderCallbacks);

	function setHasFocus(val: boolean) {
		$sliderSharedData.hasFocus = val;
	}
</script>

<div
	{...elementProps}
	bind:this={_element}
	aria-disabled={disabled || undefined}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
	aria-orientation={orientation}
	aria-valuemax={sliderMax}
	aria-valuemin={sliderMin}
	aria-valuenow={value}
	aria-valuetext={ariaValueText}
	role="slider"
	tabIndex={disabled ? -1 : 0}
	data-reach-slider-handle=""
	style={style({
		position: 'absolute',
		...(isVertical ? { bottom: handlePosition } : { left: handlePosition }),
	})}
	on:blur={composeEventHandlers(onBlur, () => setHasFocus(false))}
	on:focus={composeEventHandlers(onFocus, () => setHasFocus(true))}
	on:keydown={composeEventHandlers(onKeyDown, handleKeyDown)}
>
	<slot />
</div>

<style>
	[data-reach-slider-handle] {
		width: 16px;
		height: 16px;
		background: #1159a6;
		border-radius: 10px;
		z-index: 1;
		transform-origin: center;
	}

	[data-reach-slider-handle][aria-orientation='horizontal'] {
		top: 50%;
		transform: translateY(-50%);
	}

	[data-reach-slider-handle][aria-orientation='horizontal']:focus {
		transform: translateY(-50%);
	}

	[data-reach-slider-handle][aria-orientation='vertical'] {
		left: 50%;
		transform: translateX(-50%);
	}
</style>
