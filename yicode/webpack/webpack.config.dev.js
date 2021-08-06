// 内置模块
let path = require('path');

// 第三方模块
let Webpack = require('webpack');
let { merge } = require('webpack-merge');
let shell = require('shelljs');
let ESLintPlugin = require('eslint-webpack-plugin');
let StylelintPlugin = require('stylelint-webpack-plugin');

// 配置
let yicodePaths = require('../helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

let webpackConfigCommon = require(path.resolve(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.common.js'));

let webpackConfigCurrent = {
    // 打包发生错误时不停止打包
    bail: false,
    // 开发环境开启缓存
    cache: {
        type: 'memory',
        maxGenerations: 3
    },
    devtool: 'eval-source-map',
    optimization: {
        splitChunks: {
            automaticNameDelimiter: '~',
            chunks: 'all',
            maxAsyncRequests: 5,
            maxInitialRequests: 30,
            minChunks: 5,
            minSize: 1024 * 1024,
            // maxSize: 0,
            // maxAsyncSize: 0,
            // maxInitialSize: 0,
            usedExports: false,
            name: false,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // 重用已打包模块
                    reuseExistingChunk: true,
                    enforce: false,
                    name(_module) {
                        let packageName = _module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace('@', '')}`;
                    }
                },
                default: {
                    priority: -20,
                    // 重用已打包模块
                    reuseExistingChunk: true,
                    enforce: false,
                    name(_module) {
                        return 'default.vendors';
                    }
                }
            }
        }
    },
    plugins: [
        //
        // new Webpack.HotModuleReplacementPlugin()
        // new ESLintPlugin(yicodeConfig.eslint.options),
        // new StylelintPlugin(yicodeConfig.stylelint.options)
    ]
};
let webpackConfig = merge(webpackConfigCommon, webpackConfigCurrent);
module.exports = webpackConfig;
