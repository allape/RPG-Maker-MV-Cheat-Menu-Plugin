const path = require('path');

module.exports = {
  mode: 'production',
  entry: './build/index.js',
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
};
