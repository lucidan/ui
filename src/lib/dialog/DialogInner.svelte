<script lang="ts">
	import { onMount } from 'svelte';
	import { disableScroll } from '../utils/actions/disable-scroll';
	import { trapFocus } from '../utils/actions/trap-focus';
	import { composeEventHandlers } from '../utils/compose-event-handler';
	import { noop } from '../utils/noop';
	import { getOwnerDocument } from '../utils/owner-document';
	import type { ElementProps } from '../utils/types';

	export let element: HTMLDivElement = undefined;
	let overlayNode: HTMLDivElement;
	$: if (overlayNode) element = overlayNode;

	export let allowPinchZoom = true;
	export let dangerouslyBypassFocusLock = false;
	export let dangerouslyBypassScrollLock = false;
	export let initialFocusEl: HTMLElement = undefined;
	export let onClick: (e: MouseEvent) => void = undefined;
	export let onDismiss: (e: MouseEvent | KeyboardEvent) => void = noop;
	export let onKeyDown: (e: KeyboardEvent) => void = undefined;
	export let onMouseDown: (e: MouseEvent) => void = undefined;
	export let elementProps: ElementProps = {};

	let mouseDownTargetEl: HTMLElement;

	onMount(() => {
		initialFocusEl?.focus();
	});

	function handleClick(event: MouseEvent) {
		if (mouseDownTargetEl === event.target) {
			event.stopPropagation();
			onDismiss(event);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onDismiss(event);
		}
	}

	function handleMouseDown(event: MouseEvent) {
		mouseDownTargetEl = event.target as HTMLElement;
	}

	function ariaHider(dialogNode: HTMLElement) {
		let originalValues: any[] = [];
		let rootNodes: HTMLElement[] = [];
		let ownerDocument = getOwnerDocument(dialogNode)!;

		if (!dialogNode) {
			return;
		}

		Array.prototype.forEach.call(
			ownerDocument.querySelectorAll('body > *'),
			(node: HTMLElement) => {
				const portalNode = dialogNode.parentNode?.parentNode?.parentNode;
				if (node === portalNode) {
					return;
				}
				let attr = node.getAttribute('aria-hidden');
				let alreadyHidden = attr !== null && attr !== 'false';
				if (alreadyHidden) {
					return;
				}
				originalValues.push(attr);
				rootNodes.push(node);
				node.setAttribute('aria-hidden', 'true');
			}
		);

		return {
			destroy: () => {
				rootNodes.forEach((node, index) => {
					let originalValue = originalValues[index];
					if (originalValue === null) {
						node.removeAttribute('aria-hidden');
					} else {
						node.setAttribute('aria-hidden', originalValue);
					}
				});
			},
		};
	}
</script>

<div
	{...elementProps}
	bind:this={overlayNode}
	use:ariaHider
	use:disableScroll={{
		enabled: !dangerouslyBypassScrollLock,
		disablePinchZoom: !allowPinchZoom,
	}}
	use:trapFocus={dangerouslyBypassFocusLock}
	on:click={composeEventHandlers(onClick, handleClick)}
	on:keydown={composeEventHandlers(onKeyDown, handleKeyDown)}
	on:mousedown={composeEventHandlers(onMouseDown, handleMouseDown)}
	data-reach-dialog-overlay=""
>
	<slot />
</div>

<style>
	[data-reach-dialog-overlay] {
		background: hsla(0, 0%, 0%, 0.33);
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: auto;
	}
</style>
