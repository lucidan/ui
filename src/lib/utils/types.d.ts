export type Maybe<T> = T | undefined;

export type SaralEvent<T extends object> = CustomEvent<T & { cancel: () => void }>;

export type ElementProps<T extends HTMLElement = HTMLDivElement> = Omit<
	svelte.JSX.HTMLAttributes<T>,
	keyof svelte.JSX.DOMAttributes<T>
> & { [key in `data-${string}`]: string };
