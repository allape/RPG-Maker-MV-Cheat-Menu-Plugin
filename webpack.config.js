/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.(s?[ac]ss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    filename: 'AsCheater.js',
    path: path.resolve(__dirname, 'dist/www/js/plugins'),
  },
}
