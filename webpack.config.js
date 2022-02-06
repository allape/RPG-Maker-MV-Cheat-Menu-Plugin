/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

module.exports = {
  mode: 'production',
  entry: './build/index.js',
  devtool: 'source-map',
  output: {
    filename: 'AsCheater.js',
    path: path.resolve(__dirname, 'dist/www/js/plugins'),
  },
  module: {
    rules: [
      {
        test: /\.(s?[ac]ss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
}
