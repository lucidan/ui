import type { Properties as CSSProperties } from 'csstype';

const kebabize = (str: string) => {
	return str
		.split('')
		.map((letter, idx) => {
			return letter.toUpperCase() === letter
				? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
				: letter;
		})
		.join('');
};

/**
 * Svelte action to add style on `body`. style can either be a string or an object.
 *
 * @example
 *
 *```svelte
 * <script>
 *   import { style } from 'svelte-body';
 * </script>
 *
 * <svelte:body use:style={"background-color: blue;"} />
 * <svelte:body use:style={{ backgroundColor: 'blue' }} />
 *```
 */
export const style = (styleData: CSSProperties = {}) => {
	let str = '';

	for (const [property, value] of Object.entries(styleData)) {
		const kebabedString = kebabize(property);
		str += `${kebabedString}: ${value};`;
	}
	return str;
};
