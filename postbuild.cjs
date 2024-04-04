const fs = require('fs');

fs.copyFileSync('./plugins_patch.txt', './dist/plugins_patch.txt');
fs.copyFileSync('./plugins_patch.go.txt', './dist/plugins_patch.go.txt');


fs.unlinkSync('./dist/index.html');

fs.mkdirSync('./dist/www/js/plugins', { recursive: true });
fs.renameSync('./dist/app.js', './dist/www/js/plugins/AsCheater.js');
