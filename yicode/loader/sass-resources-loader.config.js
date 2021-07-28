let path = require('path');
let yicodePaths = require('../helper/paths.js');
module.exports = {
    loader: 'sass-resources-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false,
        resources: [path.join(yicodePaths.srcDir, 'styles', 'variable.scss')]
    }
};
