const fs = require('fs');

fs.copyFileSync('./patch.bat', './dist/patch.bat');
fs.copyFileSync('./patch.txt', './dist/patch.txt');
fs.copyFileSync('./patch-fix.bat', './dist/patch-fix.bat');
fs.copyFileSync('./patcher.html', './dist/patcher.html');
fs.copyFileSync('./patcher.json', './dist/patcher.json');

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
	console.log(`Uploading merged file to server [${remoteFileURL}]...`);
	fetch(remoteFileURL, {
		method: 'put',
		body: new Blob([mergedContent])
	}).then().catch();
}
