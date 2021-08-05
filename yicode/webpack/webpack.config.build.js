// 第三方模块
let path = require('path');
let { merge } = require('webpack-merge');
let { WebpackConfigDumpPlugin } = require('webpack-config-dump-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let configCommon = require('./webpack.config.common.js');

// 配置
let yicodePaths = require('../helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

let currentConfig = {
    // 生产环境禁用缓存
    cache: false,
    parallelism: 10,
    devtool: 'hidden-source-map',
    profile: false,
    // 打包发生错误时停止打包
    bail: true,
    optimization: {
        // minimize: false,
        // namedModules: true,
        // namedChunks: true,
        // 在设置为 true 时，告知 webpack 通过将导入修改为更短的字符串，来减少 WASM 大小。
        mangleWasmImports: true,
        // 会影响webpack性能，默认禁用
        removeAvailableModules: false,
        // 移除空的chunks
        removeEmptyChunks: true,
        // 合并相同模块的chunks，生产模式优化
        mergeDuplicateChunks: true,
        // 更小的初始化文件模块顺序
        // occurrenceOrder: false,
        // 生成模式优化，其他模式禁用，加载较大的chunk后，是否引入子集一起打包
        flagIncludedChunks: true,
        // 为export * from 生成更高效的代码，摇树优化
        providedExports: true,
        // 由webpack决定每个模块的导出内容，与providedExports有关，摇树优化
        usedExports: true,
        // 合并模块，生产模式启用，与providedExports和usedExports有关
        concatenateModules: true,
        // 副作用
        sideEffects: true,
        // 压缩导出
        mangleExports: true,
        // 内部图分析，用于摇树优化
        innerGraph: true,
        // 资源变动不重新计算内容hash
        realContentHash: true,
        // 先对记录
        portableRecords: true,
        splitChunks: {
            automaticNameDelimiter: '~',
            chunks: 'all',
            maxAsyncRequests: 3,
            maxInitialRequests: 30,
            minChunks: 5,
            minSize: 1024 * 1024,
            // maxSize: 0,
            // maxAsyncSize: 0,
            // maxInitialSize: 0,
            usedExports: true,
            name: false,
            // name: (_module, _chunks, cacheGroupKey) => {
            //     return `${cacheGroupKey}`;
            // },
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
    ]
};
if (process.env.NODE_ANALYZER === 'true') {
    currentConfig.plugins.push(
        new WebpackConfigDumpPlugin({
            outputPath: path.join(yicodePaths.cacheDir),
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
let config = merge(configCommon, currentConfig);
module.exports = config;
