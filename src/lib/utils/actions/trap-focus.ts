import { getOwnerDocument } from '../owner-document';

let trapFocusList: HTMLElement[] = [];

const isNext = (event: KeyboardEvent) => event.key === 'Tab' && !event.shiftKey;
const isPrevious = (event: KeyboardEvent) => event.key === 'Tab' && event.shiftKey;
const trapFocusListener = (event: KeyboardEvent) => {
	if (event.target === window) {
		return;
	}

	const eventTarget = event.target as Element;

	const parentNode = trapFocusList.find((node) => node.contains(eventTarget));
	if (!parentNode) {
		return;
	}

	const focusable = parentNode.querySelectorAll<HTMLElement>(
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
	);
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	if (isNext(event) && event.target === last) {
		event.preventDefault();
		first.focus();
	} else if (isPrevious(event) && event.target === first) {
		event.preventDefault();
		last.focus();
	}
};

export const trapFocus = (node: HTMLElement, disabled = false) => {
	const doc = getOwnerDocument(node);

	doc.addEventListener('keydown', trapFocusListener);

	update(disabled);

	function update(_disabled: boolean) {
		disabled = _disabled;

		if (disabled) {
			removeDOMNodeFromArray();
			return;
		}

		trapFocusList.push(node);
	}

	function removeDOMNodeFromArray() {
		trapFocusList = trapFocusList.filter((element) => element !== node);
	}

	return {
		update,
		destroy: removeDOMNodeFromArray,
	};
};
