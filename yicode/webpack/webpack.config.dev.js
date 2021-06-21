// 内置模块
let path = require('path');

// 第三方模块
let Webpack = require('webpack');
let { merge } = require('webpack-merge');
let shell = require('shelljs');
let ESLintPlugin = require('eslint-webpack-plugin');
let StylelintPlugin = require('stylelint-webpack-plugin');

// 配置
let yicodePaths = require('../yicode.paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'package.json'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'yicode.config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'scripts', 'yicode.utils.js'));

let webpackConfigCommon = require(path.resolve(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.common.js'));

let webpackConfigCurrent = {
    // 开发环境开启缓存
    cache: true,
    devtool: 'eval-source-map',
    parallelism: 1,
    // 打包发生错误时不停止打包
    bail: false,
    optimization: {
        // minimize: false,
        // namedModules: true,
        // namedChunks: true,
        moduleIds: 'named',
        chunkIds: 'named',
        // 在设置为 true 时，告知 webpack 通过将导入修改为更短的字符串，来减少 WASM 大小。
        mangleWasmImports: false,
        // 会影响webpack性能，默认禁用
        removeAvailableModules: false,
        // 移除空的chunks
        removeEmptyChunks: false,
        // 合并相同模块的chunks，生产模式优化
        mergeDuplicateChunks: false,
        // 生成模式优化，其他模式禁用，加载较大的chunk后，是否引入子集一起打包
        flagIncludedChunks: false,
        // 为export * from 生成更高效的代码，摇树优化
        providedExports: false,
        // 由webpack决定每个模块的导出内容，与providedExports有关，摇树优化
        usedExports: false,
        // 合并模块，生产模式启用，与providedExports和usedExports有关
        concatenateModules: false,
        // 副作用
        sideEffects: true,
        // 压缩导出
        mangleExports: false,
        // 内部图分析，用于摇树优化
        innerGraph: false,
        // 资源变动不重新计算内容hash
        realContentHash: true,
        // 先对记录
        portableRecords: false,
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
        new Webpack.HotModuleReplacementPlugin()
        // new ESLintPlugin(yicodeConfig.eslint.options),
        // new StylelintPlugin(yicodeConfig.stylelint.options)
    ]
};
let webpackConfig = merge(webpackConfigCommon, webpackConfigCurrent);
module.exports = webpackConfig;
