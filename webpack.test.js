process.env.NODE_ENV = 'test'

const webpack = require('webpack')
const moment = require('moment')


module.exports = {
    entry: [
        './js/src/index.js'
    ],

    output: {
        path: __dirname + '/build/',
        filename: 'bundle-' + moment().format('MMDD') + '.js',
        publicPath: 'build/'
    },

    module: {
        loaders: [
            {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/, include: __dirname},
            {test: /\.less$/, exclude: /node_modules/, loader: 'style!css!autoprefixer!less'},
            {test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!autoprefixer!sass?sourceMap'},
            {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
            {test: /\.svg$/, loader: "file"}
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)})
    ]
}
