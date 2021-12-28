export function valueToPercent(value: number, min: number, max: number) {
	return ((value - min) * 100) / (max - min);
}

export function percentToValue(percent: number, min: number, max: number) {
	return (max - min) * percent + min;
}
