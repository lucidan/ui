<script lang="ts">
	import type { Properties as CSSProperties } from 'csstype';
	import { onDestroy } from 'svelte';
	import { canUseDOM } from '../utils/can-use-dom';
	import { clamp } from '../utils/clamp';
	import { composeEventHandlers } from '../utils/compose-event-handler';
	import { useId } from '../utils/gen-id';
	import { isRightClick } from '../utils/is-right-click';
	import { makeId } from '../utils/make-id';
	import { noop } from '../utils/noop';
	import { getOwnerDocument } from '../utils/owner-document';
	import type { ElementProps, Maybe } from '../utils/types';
	import { percentToValue, valueToPercent } from '../utils/value-percent';
	import type { SliderAlignment, SliderOrientation } from './Slider.d';
	import { sliderCallbacks, sliderElements, sliderSharedData } from './slider.store';

	export let element: HTMLDivElement = null;
	$: if (sliderEl) element = sliderEl;

	export let max = 100;
	export let min = 0;
	export let ariaLabel = '';
	export let ariaLabelledBy = '';
	export let ariaValueText = '';
	export let defaultValue = min;
	export let disabled = false;
	export let value = defaultValue;
	export let getAriaLabel: (value: number) => string = null;
	export let getAriaValueText: (value: number) => string = null;
	export let handleAlignment: SliderAlignment = 'center';
	export let name: Maybe<string> = '';
	export let onChange: (data: {
		newValue: number;
		min?: number | undefined;
		max?: number | undefined;
		handlePosition?: string | undefined;
	}) => void = null;
	export let onKeyDown: (event: KeyboardEvent) => void = null;
	export let onMouseDown: (event: MouseEvent) => void = null;
	export let onMouseMove: (event: MouseEvent) => void = null;
	export let onMouseUp: (event: MouseEvent) => void = null;
	export let onPointerDown: (event: PointerEvent) => void = null;
	export let onPointerUp: (event: PointerEvent) => void = null;
	export let onTouchEnd: (event: TouchEvent) => void = null;
	export let onTouchMove: (event: TouchEvent) => void = null;
	export let onTouchStart: (event: TouchEvent) => void = null;
	export let orientation: SliderOrientation = 'horizontal';
	export let step = 0;
	export let elementProps: ElementProps = {};

	let touchID: number = undefined;
	let id = useId(elementProps.id);

	// Track whether or not the pointer is down.
	let isPointerDown = false;

	let sliderEl: HTMLDivElement;

	let hasFocus = false;
	const setHasFocus = (val: boolean) => (hasFocus = val);

	$: handleDimensions = getDimensions($sliderElements.handleEl);

	$: _value = clamp(value || defaultValue || min, min, max);

	$: trackPercent = valueToPercent(_value, min, max);
	$: isVertical = orientation === 'vertical';

	$: handleSize = (isVertical ? handleDimensions?.height : handleDimensions?.width) || 16;

	// TODO: Consider removing the `handleAlignment` prop
	// We may want to use accept a `handlePosition` prop instead and let apps
	// define their own positioning logic, similar to how we do for popovers.
	$: handlePosition = `calc(${trackPercent}% - ${
		handleAlignment === 'center' ? `${handleSize}px / 2` : `${handleSize}px * ${trackPercent / 100}`
	})`;

	$: _ariaValueText = getAriaValueText ? getAriaValueText(_value) : ariaValueText;

	$: rangeStyle = { [isVertical ? 'height' : 'width']: `${trackPercent}%` } as CSSProperties;

	$: $sliderSharedData = {
		ariaLabel: getAriaLabel ? getAriaLabel(value) : ariaLabel,
		ariaLabelledBy,
		ariaValueText,
		handlePosition,
		hasFocus,
		sliderId: id,
		sliderMax: max,
		sliderMin: min,
		value,
		disabled: !!disabled,
		isVertical,
		orientation,
		trackPercent,
		rangeStyle,
	};

	$: $sliderCallbacks = {
		handleKeyDown,
		setHasFocus,
		updateValue,
		onKeyDown,
	};

	// Slide events!
	// We will try to use pointer events if they are supported to leverage
	// setPointerCapture and releasePointerCapture. We'll fall back to separate
	// mouse and touch events.
	// TODO: This could be more concise
	let removeMoveEvents = noop;
	let removeStartEvents = noop;
	let removeEndEvents = noop;

	// @Puru: Assign here so we can remove them in the destroy method
	$: {
		// This reactive statement is dependant on sliderEl
		sliderEl;
		if (canUseDOM()) removeStartEvents = addStartListener();
	}

	onDestroy(() => {
		removeMoveEvents();
		removeStartEvents();
		removeEndEvents();
	});

	let handleSlideStart = (event: MouseEvent | TouchEvent) => {
		if (isRightClick(event)) return;

		if (disabled) {
			isPointerDown = false;
			return;
		}

		let ownerDocument = getOwnerDocument(sliderEl)!;
		let ownerWindow = ownerDocument.defaultView || window;
		isPointerDown = true;

		if ((event as TouchEvent).changedTouches) {
			// Prevent scrolling for touch events
			event.preventDefault();
			let touch = (event as TouchEvent).changedTouches?.[0];
			if (touch != null) {
				touchID = touch.identifier;
			}
		}

		let newValue = getNewValueFromEvent(event);
		if (newValue == null) {
			return;
		}
		ownerWindow.requestAnimationFrame(() => $sliderElements.handleEl?.focus());
		updateValue(newValue);

		removeMoveEvents = addMoveListener();
		removeEndEvents = addEndListener();
	};

	let handlePointerMove = (event: MouseEvent | TouchEvent) => {
		if (disabled || !isPointerDown) {
			isPointerDown = false;
			return;
		}

		let newValue = getNewValueFromEvent(event);
		if (newValue == null) {
			return;
		}

		updateValue(newValue);
	};

	function handleSlideStop(event: MouseEvent | TouchEvent) {
		if (isRightClick(event)) return;

		isPointerDown = false;

		let newValue = getNewValueFromEvent(event);
		if (newValue == null) {
			return;
		}

		touchID = undefined;

		removeMoveEvents();
		removeEndEvents();
	}

	function addMoveListener() {
		let ownerDocument = getOwnerDocument(sliderEl);
		let touchListener = composeEventHandlers(onTouchMove, handlePointerMove);
		let mouseListener = composeEventHandlers(onMouseMove, handlePointerMove);
		ownerDocument.addEventListener('touchmove', touchListener);
		ownerDocument.addEventListener('mousemove', mouseListener);
		return () => {
			ownerDocument.removeEventListener('touchmove', touchListener);
			ownerDocument.removeEventListener('mousemove', mouseListener);
		};
	}

	function addEndListener() {
		let ownerDocument = getOwnerDocument(sliderEl)!;
		let ownerWindow = ownerDocument.defaultView || window;
		let pointerListener = composeEventHandlers(onPointerUp, releasePointerCapture);
		let touchListener = composeEventHandlers(onTouchEnd, handleSlideStop);
		let mouseListener = composeEventHandlers(onMouseUp, handleSlideStop);
		if ('PointerEvent' in ownerWindow) {
			ownerDocument.addEventListener('pointerup', pointerListener);
		}
		ownerDocument.addEventListener('touchend', touchListener);
		ownerDocument.addEventListener('mouseup', mouseListener);
		return () => {
			if ('PointerEvent' in ownerWindow) {
				ownerDocument.removeEventListener('pointerup', pointerListener);
			}
			ownerDocument.removeEventListener('touchend', touchListener);
			ownerDocument.removeEventListener('mouseup', mouseListener);
		};
	}

	function addStartListener() {
		if (!sliderEl) {
			return noop;
		}

		let ownerDocument = getOwnerDocument(sliderEl)!;
		let ownerWindow = ownerDocument.defaultView || window;
		let touchListener = composeEventHandlers(onTouchStart, handleSlideStart);
		let mouseListener = composeEventHandlers(onMouseDown, handleSlideStart);
		let pointerListener = composeEventHandlers(onPointerDown, setPointerCapture);

		sliderEl.addEventListener('touchstart', touchListener);
		sliderEl.addEventListener('mousedown', mouseListener);
		if ('PointerEvent' in ownerWindow) {
			sliderEl.addEventListener('pointerdown', pointerListener);
		}
		return () => {
			sliderEl.removeEventListener('touchstart', touchListener);
			sliderEl.removeEventListener('mousedown', mouseListener);
			if ('PointerEvent' in ownerWindow) {
				sliderEl.removeEventListener('pointerdown', pointerListener);
			}
		};
	}

	function getDimensions(el: HTMLDivElement) {
		if (!el) return { width: 0, height: 0 };

		const ownerDocument = getOwnerDocument(el);
		const ownerWindow = ownerDocument.defaultView || window;

		const { height, width } = ownerWindow.getComputedStyle(el);
		let newHeight = parseFloat(height);
		let newWidth = parseFloat(width);

		if (newHeight !== 0 || newWidth !== 0) {
			return { height: newHeight, width: newWidth };
		}
	}

	function setPointerCapture(event: PointerEvent) {
		if (isRightClick(event)) return;
		if (disabled) {
			isPointerDown = false;
			return;
		}
		isPointerDown = true;
		sliderEl?.setPointerCapture(event.pointerId);
	}

	function releasePointerCapture(event: PointerEvent) {
		if (isRightClick(event)) return;
		sliderEl?.releasePointerCapture(event.pointerId);
		isPointerDown = false;
	}

	async function updateValue(val: number) {
		_value = val;

		// TODO: Reonsider the onChange callback API
		onChange?.({ newValue: val, min, max, handlePosition });
	}

	function getNewValueFromEvent(e: TouchEvent | MouseEvent) {
		return getNewValue(getPointerPosition(e, touchID), $sliderElements.trackEl, {
			step,
			orientation,
			min,
			max,
		});
	}

	// https://www.w3.org/TR/wai-aria-practices-1.2/#slider_kbd_interaction
	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;

		let newValue: number;
		let tenSteps = (max - min) / 10;
		let keyStep = step || (max - min) / 100;

		switch (e.key) {
			// Decrease the value of the slider by one step.
			case 'ArrowLeft':
			case 'ArrowDown':
				newValue = _value - keyStep;
				break;
			// Increase the value of the slider by one step
			case 'ArrowRight':
			case 'ArrowUp':
				newValue = _value + keyStep;
				break;
			// Decrement the slider by an amount larger than the step change made by
			// `ArrowDown`.
			case 'PageDown':
				newValue = _value - tenSteps;
				break;
			// Increment the slider by an amount larger than the step change made by
			// `ArrowUp`.
			case 'PageUp':
				newValue = _value + tenSteps;
				break;
			// Set the slider to the first allowed value in its range.
			case 'Home':
				newValue = min;
				break;
			// Set the slider to the last allowed value in its range.
			case 'End':
				newValue = max;
				break;
			default:
				return;
		}

		e.preventDefault();

		newValue = clamp(step ? roundValueToStep(newValue, step, min) : newValue, min, max);

		updateValue(newValue);
	}

	function getNewValue(
		handlePosition:
			| {
					x: number;
					y: number;
			  }
			| false,
		track: HTMLElement | null,
		props: {
			orientation: SliderOrientation;
			min: number;
			max: number;
			step?: number;
		}
	) {
		let { orientation, min, max, step } = props;

		if (!track || !handlePosition) {
			return null;
		}

		let { left, width, bottom, height } = track.getBoundingClientRect();
		let isVertical = orientation === 'vertical';
		let diff = isVertical ? bottom - handlePosition.y : handlePosition.x - left;
		let percent = diff / (isVertical ? height : width);
		let newValue = percentToValue(percent, min, max);

		return clamp(step ? roundValueToStep(newValue, step, min) : newValue, min, max);
	}

	/**
	 * This handles the case when num is very small (0.00000001), js will turn
	 * this into 1e-8. When num is bigger than 1 or less than -1 it won't get
	 * converted to this notation so it's fine.
	 *
	 * @param num
	 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Slider/Slider.js#L69
	 */
	function getDecimalPrecision(num: number) {
		if (Math.abs(num) < 1) {
			const parts = num.toExponential().split('e-');
			const matissaDecimalPart = parts[0].split('.')[1];
			return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
		}

		const decimalPart = num.toString().split('.')[1];
		return decimalPart ? decimalPart.length : 0;
	}

	function roundValueToStep(value: number, step: number, min: number) {
		let nearest = Math.round((value - min) / step) * step + min;
		return Number(nearest.toFixed(getDecimalPrecision(step)));
	}

	function getPointerPosition(event: MouseEvent | TouchEvent, touchId: number) {
		if (touchId !== undefined && (event as TouchEvent).changedTouches) {
			for (let i = 0; i < (event as TouchEvent).changedTouches.length; i += 1) {
				const touch = (event as TouchEvent).changedTouches[i];
				if (touch.identifier === touchId) {
					return {
						x: touch.clientX,
						y: touch.clientY,
					};
				}
			}

			return false;
		}

		return {
			x: (event as PointerEvent | MouseEvent).clientX,
			y: (event as PointerEvent | MouseEvent).clientY,
		};
	}
</script>

<div
	{...elementProps}
	bind:this={sliderEl}
	data-reach-slider-input=""
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
	tabIndex={-1}
>
	<slot {hasFocus} {id} {max} {min} value={_value} ariaValueText={_ariaValueText} />

	{#if name}
		<!-- 
			If the slider is used in a form we'll need an input field to
			capture the value. We'll assume this when the component is given a
			form field name (A `name` prop doesn't really make sense in any
			other context).
		 -->

		<input type="hidden" value={_value} {name} id={id && makeId('input', id)} />
	{/if}
</div>
