var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    main:'./js/main.js',
    ui:'./js/ui.js',
  },
  resolve: {
    fallback: [
      __dirname + '/src',
    ],
  },
  output: {
    path: __dirname + '/extension',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CleanWebpackPlugin(['extension']),
    new CopyWebpackPlugin([
      { from: 'html' },
      { from: 'manifest.json' },
      { from: 'img/linux-sunxi.org-155x155.png', to: 'icon155.png' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'ui.html',
      template: 'html/ui.html',
      chunks: ['ui'],
    }),
  ],
};
