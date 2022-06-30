import * as _ from 'lodash-es';
import autoprefixer from 'autoprefixer';

// 配置
import * as yicodePaths from '../paths.js';
import { yicodeConfig } from '../config.js';

// 默认内置插件
let postcssPlugin = [autoprefixer()];

// 动态载入插件
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
export default {
    loader: 'postcss-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false,
        postcssOptions: {
            plugins: postcssPlugin
        }
    }
};
