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
export function rect(
	node: HTMLElement,
	options: { observe?: boolean; onChange?: (rect: PRect) => void } = {}
) {
	let { observe = true, onChange = () => {} } = options;

	const observer = observeRect(node, (rect) => {
		if (!observe) return;

		onChange(rect);
	});

	observer.observe();

	return {
		update: (_observe: boolean) => {
			observe = _observe;
		},
		destroy: () => {
			observer.unobserve();
		},
	};
}
