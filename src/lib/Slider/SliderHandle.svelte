<script lang="ts">
	import { style } from '../utils/actions/style.action';
	import { composeEventHandlers } from '../utils/compose-event-handler';
	import { sliderCallbacks, sliderElements, sliderSharedData } from './slider.store';

	export let element: HTMLDivElement = null;
	let _element: HTMLDivElement;
	$: if (_element) $sliderElements.handleEl = element = _element;

	export let onBlur: (event: FocusEvent) => void = null;
	export let onFocus: (event: FocusEvent) => void = null;
	export let onKeyDown: (event: KeyboardEvent) => void = null;
	export let elementProps: Omit<
		svelte.JSX.HTMLAttributes<HTMLDivElement>,
		keyof svelte.JSX.DOMAttributes<HTMLDivElement>
	> = {};

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
	use:style={{
		position: 'absolute',
		...(isVertical ? { bottom: handlePosition } : { left: handlePosition }),
	}}
	on:blur={composeEventHandlers(onBlur, () => setHasFocus(false))}
	on:focus={composeEventHandlers(onFocus, () => setHasFocus(true))}
	on:keydown={composeEventHandlers(onKeyDown, handleKeyDown)}
>
	<slot />
</div>
