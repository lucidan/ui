interface Options {
	enabled?: boolean;
	authorizedInInputs?: number[];
	disableKeys?: boolean;
	disableScroll?: boolean;
	disableWheel?: boolean;
	disablePinchZoom?: boolean;
	keyboardKeys?: number[];
}

export const disableScroll = (node: HTMLElement, options: Options = {}) => {
	let {
		enabled,
		authorizedInInputs,
		disableKeys,
		disableScroll,
		disableWheel,
		disablePinchZoom,
		keyboardKeys,
		// space: 32, page up: 33, page down: 34, end: 35, home: 36
		// left: 37, up: 38, right: 39, down: 40
	} = options;

	let lockToScrollPos: [number, number] = [0, 0];

	update(options);

	function update(_options: Options) {
		({
			enabled = true,
			authorizedInInputs = [32, 37, 38, 39, 40],
			disableKeys = true,
			disableScroll = true,
			disableWheel = true,
			disablePinchZoom = true,
			keyboardKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40],
			// space: 32, page up: 33, page down: 34, end: 35, home: 36
			// left: 37, up: 38, right: 39, down: 40
		} = _options);

		if (!enabled) {
			removeListeners();
			return;
		}

		removeListeners();
		addListeners();
	}

	function addListeners() {
		if (disablePinchZoom) {
			document.addEventListener('touchmove', handlePinchZoom, false);
		}

		if (disableWheel) {
			document.addEventListener('wheel', handleWheel, { passive: false });
		}

		if (disableScroll) {
			lockToScrollPos = [
				document.scrollingElement?.scrollLeft ?? 0,
				document.scrollingElement?.scrollTop ?? 0,
			];

			document.addEventListener('scroll', handleScroll, { passive: false });
		}

		if (disableKeys) {
			document.addEventListener('keydown', handleKeydown, { passive: false });
		}
	}

	function removeListeners() {
		document.removeEventListener('wheel', handleWheel);
		document.removeEventListener('touchmove', handlePinchZoom);
		document.removeEventListener('scroll', handleScroll);
		document.removeEventListener('keydown', handleKeydown);
	}

	function handlePinchZoom(e: TouchEvent) {
		if (node.contains(e.target as Node)) return;

		if (e.touches.length > 1) {
			e.preventDefault();
		}
	}

	function handleWheel(e: WheelEvent | TouchEvent) {
		if (node.contains(e.target as Node)) return;

		e.preventDefault();
	}

	function handleScroll(e: Event) {
		if (node.contains(e.target as Node)) return;

		window.scrollTo(...lockToScrollPos);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (node.contains(e.target as Node)) return;

		let keys = keyboardKeys;

		if (
			['INPUT', 'TEXTAREA'].includes((e.target as HTMLInputElement | HTMLTextAreaElement).tagName)
		) {
			keys = keys.filter((key) => !authorizedInInputs.includes(key));
		}

		if (keys.includes(e.keyCode)) {
			e.preventDefault();
		}
	}

	return {
		update,
		destroy: removeListeners,
	};
};
