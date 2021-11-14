// 内置模块

// 第三方模块
import Webpack from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import shell from 'shelljs';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';

// 配置
import { cliDir } from '../paths.js';
// let yicodeConfig = require(path.resolve(cliDir, 'yicode', 'helper', 'config.js'));

import webpackConfigCommon from './webpack.config.common.js';

let webpackConfigDevelopment = {
    // 打包发生错误时不停止打包
    bail: false,
    // 开发环境开启缓存
    cache: {
        type: 'memory',
        maxGenerations: 3
    },
    devtool: 'eval-source-map',
    // optimization: {
    //     splitChunks: {
    //         automaticNameDelimiter: '~',
    //         chunks: 'all',
    //         maxAsyncRequests: 5,
    //         maxInitialRequests: 30,
    //         minChunks: 5,
    //         minSize: 1024 * 1024,
    //         usedExports: false,
    //         name: false,
    //         cacheGroups: {
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -10,
    //                 // 重用已打包模块
    //                 reuseExistingChunk: true,
    //                 enforce: false,
    //                 name(_module) {
    //                     let packageName = _module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
    //                     return `npm.${packageName.replace('@', '')}`;
    //                 }
    //             },
    //             default: {
    //                 priority: -20,
    //                 // 重用已打包模块
    //                 reuseExistingChunk: true,
    //                 enforce: false,
    //                 name(_module) {
    //                     return 'default.vendors';
    //                 }
    //             }
    //         }
    //     }
    // },
    plugins: [
        //
        // new ESLintPlugin(yicodeConfig.eslint.options),
        // new StylelintPlugin(yicodeConfig.stylelint.options)
    ]
};
export const webpackConfig = webpackMerge(webpackConfigCommon, webpackConfigDevelopment);
