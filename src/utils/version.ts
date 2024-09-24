export function getNWVersion(): string {
	try {
		return new Function(`return process.versions["nw"]`)();
	} catch (e) {
		console.error(e);
		return '0.0.0';
	}
}

export function getNodeVersion(): string {
	try {
		return new Function(`return process.version`)();
	} catch (e) {
		console.error(e);
		return 'v0.0.0';
	}
}
