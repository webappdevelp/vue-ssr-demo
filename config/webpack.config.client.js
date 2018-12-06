const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.config.base');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const PrerenderPlugin = require('prerender-spa-plugin');

function getPlugins () {
  let plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true
    }),
    new VueSSRClientPlugin()
  ];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      new PrerenderPlugin({
        staticDir: path.resolve(__dirname, '../dist'),
        routes: ['/about'],
        renderAfterDocumentEvent: 'render-event'
      })
    )
  }
  return plugins;
}

module.exports = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: 1,
      cacheGroups: {
        commons: {
          test: /[\\/]node_module[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: getPlugins()
});
