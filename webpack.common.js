const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, './src/sw.js'),
      excludes: ['**/.*', '**/*.map'],
    })
  ],
  module: {
    rules: [
      {
          test: /\.s[ac]ss$/i,
          use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
          ]
      },
      { // If you need to parse images
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      { // If you need local fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      { // Shows your web workers to webpack
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}