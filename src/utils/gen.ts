export function id(prefix?: string) {
	return `${prefix || ''}_${Date.now()}_${Math.random().toString(36).substring(2, 9)};`;
}
