/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const TerserPlugin  = require('terser-webpack-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  // devtool: 'source-map',
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.(s[ac]ss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    filename: 'AsCheater.js',
    path: path.resolve(__dirname, 'dist/www/js/plugins'),
  },
}
