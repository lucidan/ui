<script lang="ts">
	import { portal } from '../portal';
	import { canUseDOM } from '../utils/can-use-dom';
	import { noop } from '../utils/noop';
	import type { ElementProps } from '../utils/types';
	import DialogInner from './DialogInner.svelte';

	export let element: HTMLDivElement = undefined;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	export let isOpen = true;
	export let allowPinchZoom = true;
	export let elementProps: ElementProps = {};
	export let initialFocusEl = undefined;
	export let onDismiss: (event: MouseEvent | KeyboardEvent) => void = noop;

	$: {
		if (!canUseDOM()) break $;

		if (isOpen) {
			// @ts-ignore
			window.__REACH_DISABLE_TOOLTIPS = true;
		} else {
			window.requestAnimationFrame(() => {
				// Wait a frame so that this doesn't fire before tooltip does
				// @ts-ignore
				window.__REACH_DISABLE_TOOLTIPS = false;
			});
		}
	}
</script>

{#if isOpen}
	<div use:portal data-reach-dialog-wrapper>
		<DialogInner
			bind:element={_element}
			{initialFocusEl}
			{allowPinchZoom}
			{elementProps}
			{onDismiss}
		>
			<slot />
		</DialogInner>
	</div>
{/if}
