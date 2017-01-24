var webpackMerge = require('webpack-merge');
var webpackCommon = require('./webpack.common.js');

module.exports = webpackMerge(webpackCommon, {

    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    }

});
