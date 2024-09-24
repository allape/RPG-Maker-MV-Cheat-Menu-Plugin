const fs = require('fs');

fs.copyFileSync('./patch.sh', './dist/patch.sh');

const polyfillFileName = './dist/app-legacy.js';
const appFileName = './dist/app.js';

const app = fs.readFileSync(appFileName).toString('utf-8');
const polyfill = fs.readFileSync(polyfillFileName).toString('utf-8');

const mergedContent = `
try{
var module = {};
${polyfill.trim()}
(function(){
${app.trim()};
})();
}catch(e){alert(e.message);}
`.trim();

fs.mkdirSync('./dist/www/js/plugins', { recursive: true });
fs.writeFileSync('./dist/www/js/plugins/AsCheater.js', mergedContent);

fs.unlinkSync('./dist/index.html');
fs.unlinkSync(polyfillFileName);
fs.unlinkSync(appFileName);

// dufs -A .
const remoteFileURL = '';

if (remoteFileURL) {
	fetch(remoteFileURL, {
		method: 'put',
		body: new Blob([mergedContent])
	}).then().catch();
}
