// 第三方模块
import { merge as webpackMerge } from 'webpack-merge';
import { WebpackConfigDumpPlugin } from 'webpack-config-dump-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import configCommon from './webpack.config.common.js';

// 配置
import { cacheDir } from '../paths.js';

let currentConfig = {
    cache: false,
    devtool: 'nosources-source-map',
    profile: false,
    // 打包发生错误时停止打包
    bail: true,
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log']
                    }
                }
            })
        ],
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
export const webpackConfig = webpackMerge(configCommon, currentConfig);
