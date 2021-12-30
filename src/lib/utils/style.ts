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

const vendorRe = /^(Webkit|Moz|O|ms)/;

export const style = (styleData: CSSProperties = {}) => {
	let str = '';

	for (let [property, value] of Object.entries(styleData)) {
		const isPropertyAVendor = vendorRe.test(property);

		property = property.replace(vendorRe, '-$1');

		let kebabedString = kebabize(property);
		if (isPropertyAVendor && !kebabedString.startsWith('--')) {
			kebabedString = kebabedString.substring(1);
		}

		str += `${kebabedString}: ${value};`;
	}

	return str;
};
