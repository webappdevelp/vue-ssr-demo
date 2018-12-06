const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const isProd = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'none' : 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/dist/'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.mjs', '.js', '.json', '.vue']
  },
  module: {
    noParse: /^(vue|vuex|vue-router|vux-router-sync)$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
