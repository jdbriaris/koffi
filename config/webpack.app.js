var webpackMerge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');

module.exports = webpackMerge(webpackCommon, {

    entry: {
        'app': './src/main.ts'
    }

});
