import type { Properties as CSSProperties } from 'csstype';

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
export const style = (node: HTMLElement, styleData: CSSProperties | string = {}) => {
	// Pseudo Element for style parsing and keeping track of styles
	const pseudoElement = document.createElement('div');

	const update = (styleData: CSSProperties | string = {}) => {
		if (typeof styleData == 'string') pseudoElement.style.cssText = styleData;

		if (typeof styleData == 'object')
			for (const [property, value] of Object.entries(styleData)) {
				// Do a setProperty in case it's a CSS variable
				if (property.startsWith('--')) {
					pseudoElement.style.setProperty(property, value);
				} else {
					pseudoElement.style[property] = value;
				}
			}

		// Combine body's existing styles with computed ones
		node.style.cssText = `
        ${node.style.cssText};
        ${pseudoElement.style.cssText};
      `;
	};

	// Initial Update
	update(styleData);

	const unset = () => {
		// Remove the pseudoElements styles on the body
		node.style.cssText = node.style.cssText.replace(pseudoElement.style.cssText, '');

		// Clear pseudoElement
		pseudoElement.style.cssText = '';
	};

	return {
		update: (styleData: CSSProperties | string = {}) => {
			unset();
			update(styleData);
		},

		destroy: unset,
	};
};
