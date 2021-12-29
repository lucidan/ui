/// <reference types="@sveltejs/kit" />

declare namespace svelte.JSX {
	interface DomAttributes {
		onrectchange?: (e: CustomEvent<PRect>) => void;
	}
}
