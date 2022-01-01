<script lang="ts">
	import type { SliderAlignment, SliderOrientation } from './Slider';
	import SliderHandle from './SliderHandle.svelte';
	import SliderInput from './SliderInput.svelte';
	import SliderRange from './SliderRange.svelte';
	import SliderTrack from './SliderTrack.svelte';

	export let element: HTMLDivElement = null;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	type $$Props = {
		element?: HTMLDivElement;
		/**
		 * The defaultValue is used to set an initial value for an uncontrolled
		 * Slider.
		 *
		 * @see Docs https://reach.tech/slider#slider-defaultvalue
		 */
		defaultValue?: number;
		/**
		 * @see Docs https://reach.tech/slider#slider-disabled
		 */
		disabled?: boolean;
		/**
		 * Whether or not the slider should be disabled from user interaction.
		 *
		 * @see Docs https://reach.tech/slider#slider-value
		 */
		value?: number;
		/**
		 * A function used to set a human-readable name for the slider.
		 *
		 * @see Docs https://reach.tech/slider#slider-getarialabel
		 */
		getAriaLabel?(value: number): string;
		/**
		 * A function used to set a human-readable value text based on the slider's
		 * current value.
		 *
		 * @see Docs https://reach.tech/slider#slider-getariavaluetext
		 */
		getAriaValueText?(value: number): string;
		/**
		 * Deprecated. Use `getAriaValueText` instead.
		 *
		 * @deprecated
		 * @param value
		 */
		getValueText?(value: number): string;
		/**
		 * When set to `center`, the slider's handle will be positioned directly
		 * centered over the slider's curremt value on the track. This means that when
		 * the slider is at its min or max value, a visiable slider handle will extend
		 * beyond the width (or height in vertical mode) of the slider track. When set
		 * to `contain`, the slider handle will always be contained within the bounds
		 * of the track, meaning its position will be slightly offset from the actual
		 * value depending on where it sits on the track.
		 *
		 * @see Docs https://reach.tech/slider#slider-handlealignment
		 */
		handleAlignment?: SliderAlignment;
		/**
		 * The maximum value of the slider. Defaults to `100`.
		 *
		 * @see Docs https://reach.tech/slider#slider-max
		 */
		max?: number;
		/**
		 * The minimum value of the slider. Defaults to `0`.
		 *
		 * @see Docs https://reach.tech/slider#slider-min
		 */
		min?: number;
		/**
		 * If the slider is used as a form input, it should accept a `name` prop to
		 * identify its value in context of the form.
		 *
		 * @see Docs https://reach.tech/slider#slider-name
		 */
		name?: string;
		/**
		 * Callback that fires when the slider value changes. When the `value` prop is
		 * set, the Slider state becomes controlled and `onChange` must be used to
		 * update the value in response to user interaction.
		 *
		 * @see Docs https://reach.tech/slider#slider-onchange
		 */
		onChange?(
			newValue: number,
			props?: {
				min?: number;
				max?: number;
				handlePosition?: string;
			}
		): void;

		// We use native DOM events for the slider since they are global
		onMouseDown?(event: MouseEvent): void;
		onMouseMove?(event: MouseEvent): void;
		onMouseUp?(event: MouseEvent): void;
		onPointerDown?(event: PointerEvent): void;
		onPointerUp?(event: PointerEvent): void;
		onTouchEnd?(event: TouchEvent): void;
		onTouchMove?(event: TouchEvent): void;
		onTouchStart?(event: TouchEvent): void;

		/**
		 * Sets the slider to horizontal or vertical mode.
		 *
		 * @see Docs https://reach.tech/slider#slider-orientation
		 */
		orientation?: SliderOrientation;
		/**
		 * The step attribute is a number that specifies the granularity that the
		 * value must adhere to as it changes. Step sets minimum intervals of change,
		 * creating a "snap" effect when the handle is moved along the track.
		 *
		 * @see Docs https://reach.tech/slider#slider-step
		 */
		step?: number;
	} & Omit<
		svelte.JSX.HTMLAttributes<HTMLDivElement>,
		keyof svelte.JSX.DOMAttributes<HTMLDivElement>
	>;
</script>

<SliderInput {...$$props} bind:element={_element} elementProps={{ 'data-reach-slider': '' }}>
	<SliderTrack>
		<SliderRange />
		<SliderHandle />
		<slot />
	</SliderTrack>
</SliderInput>
