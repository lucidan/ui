<script lang="ts">
	export let element: HTMLDivElement = null;
	let _element: HTMLDivElement;
	$: if (_element) element = _element;

	export let allowPinchZoom = true;
</script>
