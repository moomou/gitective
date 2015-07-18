var webpack = require('webpack');
var path = require('path');

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

// For having a separate stylesheet to avoid FOUC.
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].js'
  },

  module: {
    loaders: [
      // ES6 support
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // SASS compilation
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style',
            'css!autoprefixer!sass?outputStyle=expanded&includePaths[]=' + path.resolve(__dirname, './node_modules'))
      }
    ]
  },

  externals: {
    'chance': 'chance',
    'd3': 'd3',
    'firebase': 'Firebase',
    'moment': 'moment',
    'randomColor': 'randomColor'
  },

  resolve: {
    modulesDirectories: ['src', 'sass', 'node_modules'],
    extensions: ['', '.js', '.json', '.coffee', '.jsx']
  },

  plugins: [
    definePlugin,
    new ExtractTextPlugin('[name].css')
  ],

  debug: true
};
