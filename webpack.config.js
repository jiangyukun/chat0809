const webpack = require('webpack')

const basePath = 'D:/2016/projects/tigermed-app/backed-web/src/main/webapp/chat-system/js/';
const basePath1 = './js/';

module.exports = {

    entry: {
        app: [basePath1 + 'app.js']
    },

    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/asserts/'
    },

    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'react-hot!babel'},
            {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel'},
            {test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!autoprefixer!sass?sourceMap'}
        ]
    },

    node: {
        Buffer: false
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.HotModuleReplacementPlugin()
    ]

}

