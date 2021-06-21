let path = require('path');
module.exports = {
    loader: 'css-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false
    }
};
