const fs = require('fs');

const entryFile = 'node_modules/@vitejs/plugin-legacy/dist/index.mjs';

const viteLegacyContent = fs.readFileSync(entryFile).toString('utf-8').split('\n');

viteLegacyContent.forEach((line, index) => {
	if (line.includes('`No corresponding legacy entry chunk found for ${htmlFilename}`')) {
		viteLegacyContent[index - 1] = '';
		viteLegacyContent[index] = '';
		viteLegacyContent[index + 1] = '';
		console.warn(entryFile, 'has been patched');
	}
});

fs.writeFileSync(entryFile, viteLegacyContent.join('\n'));
