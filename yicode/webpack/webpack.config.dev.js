// 内置模块
import { resolve } from 'path';
// 第三方模块
import Webpack from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import shell from 'shelljs';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import { WebpackConfigDumpPlugin } from 'webpack-config-dump-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// 配置
import { cliDir, cacheDir } from '../paths.js';
import * as yicodeUtils from '../utils.js';
// let yicodeConfig = require(path.resolve(cliDir, 'yicode', 'helper', 'config.js'));

import webpackConfigCommon from './webpack.config.common.js';

let currentConfig = {
    // 打包发生错误时不停止打包
    bail: false,
    // 开发环境开启缓存
    // cache: false,
    cache: {
        type: 'memory',
        maxGenerations: 1
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
if (process.env.NODE_ANALYZER === 'true') {
    currentConfig.plugins.push(
        new WebpackConfigDumpPlugin({
            outputPath: cacheDir,
            name: 'webpack.config.dump.js',
            keepCircularReferences: true,
            showFunctionNames: false,
            includeFalseValues: true
        })
    );
    currentConfig.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'parsed',
            generateStatsFile: false,
            openAnalyzer: true
        })
    );
}
export const webpackConfig = webpackMerge(webpackConfigCommon, currentConfig);
