/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const { DefinePlugin }  = require('webpack')
const TerserPlugin  = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const BUILD_LEGACY = !!process.env.BUILD_LEGACY

module.exports = {
  mode: 'production',
  entry: BUILD_LEGACY ? './src/legacy-index.ts' : './src/index.ts',
  // devtool: 'source-map',
  target: BUILD_LEGACY ? ['web', 'es5'] : undefined,
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new DefinePlugin({
      BUILD_LEGACY,
    }),
  ],
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
              ...(BUILD_LEGACY ? ['@babel/preset-env'] : []),
            ],
          },
        },
      },
      {
        test: /\.(s[ac]ss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `$BUILD_LEGACY: ${BUILD_LEGACY};`,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
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
