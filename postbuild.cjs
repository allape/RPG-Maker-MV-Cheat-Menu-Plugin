const fs = require('fs');

fs.copyFileSync('./plugins_patch.txt', './dist/plugins_patch.txt');
fs.copyFileSync('./plugins_patch.go.txt', './dist/plugins_patch.go.txt');

const polyfillFileName = './dist/app-legacy.js';
const appFileName = './dist/app.js';

const app = fs.readFileSync(appFileName).toString('utf-8');
const polyfill = fs.readFileSync(polyfillFileName).toString('utf-8');

const mergedContent = `
try{
var module = {};
${polyfill.trim()}
(function(){${app.trim()}})();
}catch(e){alert(e.message);}
`;

fs.mkdirSync('./dist/www/js/plugins', { recursive: true });
fs.writeFileSync('./dist/www/js/plugins/AsCheater.js', mergedContent);

fs.unlinkSync('./dist/index.html');
fs.unlinkSync('./dist/app.js');
fs.unlinkSync('./dist/app-legacy.js');

// dufs -A .
const remoteFileURL = '';

if (remoteFileURL) {
	fetch(remoteFileURL, {
		method: 'put',
		body: new Blob([mergedContent])
	}).then();
}
