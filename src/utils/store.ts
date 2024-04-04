
export function getJSON<T = unknown>(key: string, defaultValue: T, validate?: (obj: unknown) => boolean): T {
	if (typeof localStorage === 'undefined') {
		return defaultValue;
	}
	const value = localStorage.getItem(key);
	if (!value) {
		return defaultValue;
	}
	try {
		const obj = JSON.parse(value);
		return !validate || validate(obj) ? obj : defaultValue;
	} catch (e) {
		return defaultValue;
	}
}
