/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')

fs.copyFileSync('./plugins_patch.txt', './dist/plugins_patch.txt')
fs.copyFileSync('./plugins_patch.go.txt', './dist/plugins_patch.go.txt')
fs.copyFileSync('./plugins_patch.legacy.go.txt', './dist/plugins_patch.legacy.go.txt')

fs.copyFileSync('./dist/www/js/plugins/AsCheater.js', './public/AsCheater.js')

const legacyAsCheater = './dist/www/js/plugins/AsCheater_legacy.js'
if (fs.existsSync(legacyAsCheater)) {
  fs.copyFileSync(legacyAsCheater, './public/AsCheater_legacy.js')
}

const sourceMapPath = './dist/www/js/plugins/AsCheater.js.map'
if (fs.existsSync(sourceMapPath)) {
  fs.copyFileSync(sourceMapPath, './public/AsCheater.js.map')
  fs.rmSync(sourceMapPath, { force: true })
}

const copycat = path.join(__dirname, 'copycat.json')
if (fs.existsSync(copycat)) {
  const thingsToCopy = require(copycat)
  Object.keys(thingsToCopy).forEach(source => {
    const sourceFilePath = path.join(__dirname, source)
    if (fs.existsSync(sourceFilePath)) {
      const destDir = path.dirname(thingsToCopy[source])
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
      fs.copyFileSync(sourceFilePath, thingsToCopy[source])
      console.log(`copy [${sourceFilePath}] to [${thingsToCopy[source]}]`)
    }
  })
}
