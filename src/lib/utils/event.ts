import { custom_event, get_current_component } from 'svelte/internal';

export function saralEventDispatcher<EventMap extends {} = any>(): <
	EventKey extends Extract<keyof EventMap, string>
>(
	type: EventKey,
	detail?: EventMap[EventKey]
) => CustomEvent<EventMap[EventKey]> {
	const component = get_current_component();

	return (type: string, detail?: any): CustomEvent<any> => {
		const callbacks = component.$$.callbacks[type];

		if (callbacks) {
			// TODO are there situations where events could be dispatched
			// in a server (non-DOM) environment?
			const event = custom_event(type, detail);
			callbacks.slice().forEach((fn: Function) => {
				fn.call(component, event);
			});

			return event;
		}
	};
}
