var webpack = require('webpack');
var path = require('path');

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

// For having a separate stylesheet to avoid FOUC.
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './main.js',

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].js'
  },

  module: {
    loaders: [
      // React.js
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?harmony',
        exclude: /node_modules/
      },
      // ES6 support
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // SASS compilation
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style',
            'css!autoprefixer!sass?outputStyle=expanded&"' + "includePaths[]=" + path.resolve(__dirname, "./node_modules"))
      },
      {

      }
    ]
  },

  resolve: {
    modulesDirectories: ['src', 'sass', 'node_modules'],
    extensions: ['', '.js', '.json', '.coffee', '.jsx']
  },

  plugins: [
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new ExtractTextPlugin("default.css"),
  ],

  debug: true
};
