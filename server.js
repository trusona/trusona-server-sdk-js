var webpack = require('webpack');
var WebPackDevServer = require('webpack-dev-server');

var path = require('path');

var config = require('./webpack.config')

new WebPackDevServer(webpack(config), {
    contentBase : 'public/',
    publicPath: '',
    inline: true, 
    hot: true

}).listen(8080, 'localhost', function(err, result){
    if(err){
      return console.log(err);
    }
    console.log('Listening at http://localhost:8080/');
});
// 'use strict';

// const express = require('express');

// // Constants
// const PORT = 8080;
// const HOST = '0.0.0.0';

// // App
// const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello world\n');
// });

// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);