<script lang="ts" context="module">
	import type { Properties as CSSProperties } from 'csstype';
	import { style as styleFunc } from '../utils/style';

	export function visuallyHidden(node: HTMLElement, styles: CSSProperties = {}) {
		const nodeStyle = node.getAttribute('style') || '';

		function update(styles: CSSProperties) {
			const myStyle =
				styleFunc({
					border: 0,
					clip: 'rect(0 0 0 0)',
					height: '1px',
					margin: '-1px',
					overflow: 'hidden',
					padding: 0,
					position: 'absolute',
					width: '1px',

					// https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
					whiteSpace: 'nowrap',
					wordWrap: 'normal',
					...styles,
				}) + nodeStyle;

			node.style.cssText = myStyle;
		}

		update(styles);

		return {
			update,
			destroy: () => {
				node.style.cssText = nodeStyle;
			},
		};
	}
</script>

<script lang="ts">
	export let style: CSSProperties = {};
</script>

<span
	style={styleFunc({
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: '1px',
		margin: '-1px',
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		width: '1px',

		// https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
		whiteSpace: 'nowrap',
		wordWrap: 'normal',
		...style,
	})}
>
	<slot />
</span>
