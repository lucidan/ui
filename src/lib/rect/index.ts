import observeRect from '@reach/observe-rect';

type PRect = Partial<DOMRect> & {
	readonly bottom: number;
	readonly height: number;
	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly width: number;
};

/**
 * @param node
 * @param observeOrOptions Pass `true` to observe, `false` to ignore.
 */
export function rect(node: HTMLElement, observe: boolean = true) {
	fireOnChange(node.getBoundingClientRect());

	const observer = observeRect(node, (rect) => {
		if (!observe) return;

		fireOnChange(rect);
	});

	observer.observe();

	function fireOnChange(data: PRect) {
		node.dispatchEvent(new CustomEvent('rectchange', { detail: data }));
	}

	return {
		update: (_observe: boolean) => {
			observe = _observe;
		},
		destroy: () => {
			observer.unobserve();
		},
	};
}
