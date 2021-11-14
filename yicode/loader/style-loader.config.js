import MiniCssExtractPlugin from 'mini-css-extract-plugin';
let lodaerOptions = {
    loader: 'style-loader'
};
if (process.env.NODE_MODE === 'production') {
    lodaerOptions = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../'
        }
    };
}
export default lodaerOptions;
