const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
    // devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './js/src/index.js'
    ],

    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js',
        publicPath: '/static/'
    },

    module: {
        loaders: [
            {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/, include: __dirname},
            {test: /\.less$/, loader: 'style!css!autoprefixer!less'},
            {test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!postcss!sass?sourceMap'},
            {test: /\.(jpg|png)$/, loaders: ['url?limit=8192']},
            {test: /\.svg$/, loader: "file"}
        ]
    },
    postcss: [
        autoprefixer({browsers: ['last 2 versions']})
    ],
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
        new webpack.HotModuleReplacementPlugin()
    ]
}
