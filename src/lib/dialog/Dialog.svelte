<script lang="ts">
	import { noop } from '../utils/noop';
	import type { ElementProps } from '../utils/types';
	import DialogContent from './DialogContent.svelte';
	import DialogOverlay from './DialogOverlay.svelte';

	export let element: HTMLDivElement = undefined;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	export let allowPinchZoom = false;
	export let initialFocusEl: HTMLElement = undefined;
	export let isOpen: boolean;
	export let onDismiss: (event: MouseEvent | KeyboardEvent) => void = noop;
	export let elementProps: ElementProps = {};
</script>

<DialogOverlay {allowPinchZoom} {initialFocusEl} {isOpen} {onDismiss}>
	<DialogContent bind:element={_element} {...elementProps}>
		<slot />
	</DialogContent>
</DialogOverlay>
