var webpack = require('webpack');
var path = require('path');
var glob = require('glob');

var plugins = [];

var outPutFile = 'bundle.js';

var config = {
    entry: [
        './src/js/common.js'      //入口
    ],
    output: {
        path: path.resolve(__dirname, './src/dist/'),
        filename: outPutFile
    },
    module: {
        loaders:[
            {
                test: /\.scss/,
                loaders: ['style', 'css', 'sass'],
                include: path.resolve(__dirname, 'app')
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    target: 'node',
    plugins: plugins,
    watch: true
};
module.exports = config;
