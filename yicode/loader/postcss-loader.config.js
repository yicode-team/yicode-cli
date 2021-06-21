let myConfig = require('../yicode.paths.js');
let yicodeConfig = require('../yicode.config.js');
let autoprefixer = require('autoprefixer');
let _ = require('lodash');
let postcssPlugin = [autoprefixer()];
if (yicodeConfig.px2viewport && yicodeConfig.px2viewport.enable === true) {
    postcssPlugin.push([
        'postcss-px-to-viewport',
        _.merge(
            {
                unitToConvert: 'px',
                viewportWidth: 750,
                unitPrecision: 5,
                propList: ['*'],
                viewportUnit: 'vw',
                fontViewportUnit: 'vw',
                selectorBlackList: [],
                minPixelValue: 1,
                mediaQuery: false,
                replace: true,
                exclude: [],
                landscape: false,
                landscapeUnit: 'vw',
                landscapeWidth: 568
            },
            yicodeConfig.px2viewport.options
        )
    ]);
}
module.exports = {
    loader: 'postcss-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false,
        postcssOptions: {
            plugins: postcssPlugin
        }
    }
};
