import type { Properties as CSSProperties } from 'csstype';

const kebabize = (str: string) => {
	return str
		.split('')
		.map((letter, idx) => {
			return letter.toUpperCase() === letter
				? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
				: letter;
		})
		.join('');
};

export const style = (styleData: CSSProperties = {}) => {
	let str = '';

	for (const [property, value] of Object.entries(styleData)) {
		const kebabedString = kebabize(property);
		str += `${kebabedString}: ${value};`;
	}
	return str;
};
