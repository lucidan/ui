<script lang="ts">
	import { composeEventHandlers } from '../utils/compose-event-handler';

	import type { ElementProps } from '../utils/types';

	export let element: HTMLDivElement = undefined;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	export let elementProps: ElementProps = {};
	export let onClick: (event: MouseEvent) => void = undefined;
	export let onKeyDown: (event: KeyboardEvent) => void = undefined;
</script>

<div
	aria-modal="true"
	role="dialog"
	tabIndex={-1}
	{...elementProps}
	data-reach-dialog-content
	on:click={composeEventHandlers(onClick, (event) => {
		event.stopPropagation();
	})}
	on:keydown={onKeyDown}
>
	<slot />
</div>

<style>
	/* Used to detect in JavaScript if apps have loaded styles or not. */
	:root {
		--reach-dialog: 1;
	}

	[data-reach-dialog-content] {
		width: 50vw;
		margin: 10vh auto;
		background: white;
		padding: 2rem;
		outline: none;
	}
</style>
