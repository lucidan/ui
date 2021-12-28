import type { Properties as CSSProperties } from 'csstype';
import { writable } from 'svelte/store';
import type { SliderOrientation } from '.';

type SliderContext = {
	ariaLabel: string | undefined;
	ariaLabelledBy: string | undefined;
	ariaValueText: string | undefined;
	handlePosition: string;
	hasFocus: boolean;
	sliderId: string | undefined;
	sliderMax: number;
	sliderMin: number;
	value: number;
	disabled: boolean;
	isVertical: boolean;
	orientation: SliderOrientation;
	trackPercent: number;
	rangeStyle: CSSProperties;
};

export const sliderElements = writable<{ handleEl: HTMLDivElement; trackEl: HTMLDivElement }>(
	{} as any
);

export const sliderCallbacks = writable<{
	onKeyDown?: (event: KeyboardEvent) => void;
	handleKeyDown: (event: KeyboardEvent) => void;
	setHasFocus: (val: boolean) => void;
	updateValue: (newValue: any) => void;
}>({} as any);

export const sliderSharedData = writable<SliderContext>({} as any);
