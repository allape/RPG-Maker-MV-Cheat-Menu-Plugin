import type { Script } from './declare';

export function NewScript(script: string): Script {
	return script
		.split('\n')
		.filter((line) => line.trim() !== '')
		.map((line) => line.trim())
		.join('\n');
}
