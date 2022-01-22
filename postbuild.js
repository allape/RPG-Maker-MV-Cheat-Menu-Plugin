/* eslint-disable */

const fs = require('fs')
const path = require('path')

fs.copyFileSync('./plugins_patch.txt', './dist/plugins_patch.txt')
fs.copyFileSync('./plugins_patch.go.txt', './dist/plugins_patch.go.txt')

fs.copyFileSync('./dist/www/js/plugins/AsCheater.js', './public/index.js')

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
