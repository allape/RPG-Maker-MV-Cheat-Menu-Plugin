const fs = require('fs');

// region change plugin-legacy

const viteLegacy = 'node_modules/@vitejs/plugin-legacy/dist/index.mjs';
const viteLegacyContent = fs.readFileSync(viteLegacy).toString('utf-8').split('\n');
viteLegacyContent.forEach((line, index) => {
	if (line.includes('`No corresponding legacy entry chunk found for ${htmlFilename}`')) {
		viteLegacyContent[index - 1] = '';
		viteLegacyContent[index] = '';
		viteLegacyContent[index + 1] = '';
		console.warn(viteLegacy, 'has been patched');
	}
});
fs.writeFileSync(viteLegacy, viteLegacyContent.join('\n'));

// endregion

// region change svelte/compiler

const compiledSvelteCompilerFile = 'node_modules/svelte/compiler/index.js';
const compiledSvelteCompilerContent = fs.readFileSync(compiledSvelteCompilerFile).toString('utf-8');
const compiledSvelteCompilerMarker = '`:where(${e})`';
if (compiledSvelteCompilerContent.includes(compiledSvelteCompilerMarker)) {
	fs.writeFileSync(
		compiledSvelteCompilerFile,
		compiledSvelteCompilerContent.replace(compiledSvelteCompilerMarker, '`${e}`')
	);
	console.warn(compiledSvelteCompilerFile, 'has been patched');
}

const svelteCompilerFile = 'node_modules/svelte/src/compiler/phases/3-transform/css/index.js';
const svelteCompilerContent = fs.readFileSync(svelteCompilerFile).toString('utf-8');
const svelteCompilerMarker = '`:where(${modifier})`';
if (svelteCompilerContent.includes(svelteCompilerMarker)) {
	fs.writeFileSync(
		svelteCompilerFile,
		svelteCompilerContent.replace(svelteCompilerMarker, '`${modifier}`')
	);
	console.warn(svelteCompilerFile, 'has been patched');
}

// endregion
