const validator = require('webpack-validator');
const path = require('path');
const webpack = require('webpack');

const config = {

    entry : [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        path.join( __dirname, 'src/Router.jsx')
    ],
    output : {
        path: path.join( __dirname, 'public/assets/js/'),
        filename : 'build.js',
        publicPath: '',
    },
    module : {
        loaders: [
            {
                test: /\.js|jsx$/, loaders: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]

};
module.exports = validator(config);