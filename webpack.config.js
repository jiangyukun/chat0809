/**
 *
 */

// process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'production'

const webpack = require('webpack')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './js/app.js'
    ],

    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js',
        publicPath: '/static/'
    },

    module: {
        loaders: [
            {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/, include: __dirname},
            {test: /\.less$/, exclude: /node_modules/, loader: 'style!css!autoprefixer!less'},
            {test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!autoprefixer!sass?sourceMap'},
            {test: /\.(jpg|png)$/, loader: "url?limit=8192"}
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
        new webpack.HotModuleReplacementPlugin()
    ]
}
