const fs = require('fs');

fs.copyFileSync('./cm-patch.bat', './dist/cm-patch.bat');
fs.copyFileSync('./cm-patch.json', './dist/cm-patch.json');
fs.copyFileSync('./cm-patch-fix.bat', './dist/cm-patch-fix.bat');
fs.copyFileSync('./cm-patcher.html', './dist/cm-patcher.html');
fs.copyFileSync('./cm-patcher-package.json', './dist/cm-patcher-package.json');

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

// mv
fs.mkdirSync('./dist/www/js/plugins', { recursive: true });
fs.writeFileSync('./dist/www/js/plugins/AsCheater.js', mergedContent);

// mz
fs.mkdirSync('./dist/js/plugins', { recursive: true });
fs.writeFileSync('./dist/js/plugins/AsCheater.js', mergedContent);

// docs, for dummy preview on GitHub
fs.mkdirSync('./docs', { recursive: true });
fs.renameSync('./dist/index.html', './docs/index.html');
fs.writeFileSync('./docs/app.js', mergedContent);
fs.writeFileSync('./docs/app-legacy.js', '');

// remove source
fs.unlinkSync(polyfillFileName);
fs.unlinkSync(appFileName);

// dufs -A .
const remoteFileURL = '';

if (remoteFileURL) {
	console.log(`Uploading merged file to server [${remoteFileURL}]...`);
	fetch(remoteFileURL, {
		method: 'put',
		body: new Blob([mergedContent])
	})
		.then()
		.catch();
}
