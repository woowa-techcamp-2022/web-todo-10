const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name]_bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png/,
        type: 'asset/inline',
      },
    ],
  },
  watch: true,
  devtool: 'eval',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@style': path.resolve(__dirname, 'src', 'style'),
      '@imgs': path.resolve(__dirname, 'src', 'imgs'),
      '@util': path.resolve(__dirname, 'src', 'util'),
    },
    extensions: ['.js', '.scss'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
  ],
};
