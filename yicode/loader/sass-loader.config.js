module.exports = {
    loader: 'sass-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false
    }
};
