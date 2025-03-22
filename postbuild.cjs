const fs = require("node:fs");
const path = require("node:path");

fs.mkdirSync("./dist", { recursive: true });

fs.copyFileSync("./cm-patch.bat", "./dist/cm-patch.bat");
fs.copyFileSync("./cm-patch.json", "./dist/cm-patch.json");
fs.copyFileSync("./cm-patch-fix.bat", "./dist/cm-patch-fix.bat");
fs.copyFileSync("./cm-patcher.html", "./dist/cm-patcher.html");
fs.copyFileSync("./cm-patcher-package.json", "./dist/cm-patcher-package.json");

let polyfillFileName = "";
let indexLegacyFileName = "";
let indexFileName = "";

const assetsFolder = "./docs/assets";
fs.readdirSync(assetsFolder).forEach((name) => {
  if (name.startsWith("index-legacy-")) {
    indexLegacyFileName = path.join(assetsFolder, name);
  } else if (name.startsWith("index-")) {
    indexFileName = path.join(assetsFolder, name);
  } else if (name.startsWith("polyfills-legacy-")) {
    polyfillFileName = path.join(assetsFolder, name);
  }
});

if (!polyfillFileName) {
  console.error("Polyfill file not found.");
  process.exit(1);
} else if (!indexFileName) {
  console.error("Index file not found.");
  process.exit(1);
} else if (!indexLegacyFileName) {
  console.error("Index legacy file not found.");
  process.exit(1);
}

const index = fs.readFileSync(indexFileName).toString("utf-8");
const indexLegacy = fs.readFileSync(indexLegacyFileName).toString("utf-8");
const polyfill = fs.readFileSync(polyfillFileName).toString("utf-8");

const mergedContent = `
try{
${polyfill.trim()}
var module = {};
${index.trim()}
}catch(e){alert(e.message);}
`.trim();

// mv
fs.mkdirSync("./dist/www/js/plugins", { recursive: true });
fs.writeFileSync("./dist/www/js/plugins/AsCheater.js", mergedContent);

// mz
fs.mkdirSync("./dist/js/plugins", { recursive: true });
fs.writeFileSync("./dist/js/plugins/AsCheater.js", mergedContent);

// dufs -A .
const remoteFileURL = "";

if (remoteFileURL) {
  console.log(`Uploading merged file to server [${remoteFileURL}]...`);
  fetch(remoteFileURL, {
    method: "put",
    body: new Blob([mergedContent]),
  })
    .then()
    .catch();
}
