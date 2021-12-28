let id = 0;
const genId = () => ++id;

export function useId(idFromProps?: string | null) {
	return idFromProps || genId() + '';
}
