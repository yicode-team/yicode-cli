let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let obj = {
    loader: 'style-loader'
};
if (process.env.NODE_MODE === 'production') {
    obj = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../'
        }
    };
}
module.exports = obj;
