export default {
    loader: 'css-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false
    }
};
