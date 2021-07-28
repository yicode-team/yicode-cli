let path = require('path');
let _ = require('lodash');
let autoprefixer = require('autoprefixer');

// 配置
let yicodePaths = require('../helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

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
