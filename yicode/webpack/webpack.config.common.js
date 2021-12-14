// 内部模块
import { resolve } from 'path';

// 第三方模块
import Webpack from 'webpack';
import * as _ from 'lodash-es';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ImportFresh from 'import-fresh';
// import WindiCSSWebpackPlugin from 'windicss-webpack-plugin';

//  配置文件
import { cliDir, srcDir, rootDir, distDir } from '../paths.js';
import { yicodePackage } from '../package.js';
import yicodeConfig from '../config.js';
import { requireResolve } from '../utils.js';

//  loader配置文件
import _loaderPostCssConfig from '../loader/postcss-loader.config.js';
import _loaderBabelConfig from '../loader/babel-loader.config.js';
import _loaderCssConfig from '../loader/css-loader.config.js';
import _loaderSassConfig from '../loader/sass-loader.config.js';
import _loaderStyleConfig from '../loader/style-loader.config.js';
import _loaderSassResourcesConfig from '../loader/sass-resources-loader.config.js';
import _loaderRouteConfig from '../loader/route-loader.config.js';

// plugin 配置文件
import AutoRoutePlugin from '../plugin/auto-route-plugin.js';
// let _pluginProvideConfig = require("./plugin/provide-plugin.config.js");

// 导出webpack通用配置
let webpackConfigCommon = {
    name: 'yicode-cli',
    // 打包发生错误时停止打包
    bail: false,
    // 缓存，生产模式禁用
    cache: false,
    // 编译模式
    mode: 'development',
    // mode: 'production',
    // 入口
    entry: resolve(srcDir, 'main.js'),
    // 基础目录，绝对路径，用于从配置中解析入口点(entry point)和 加载器(loader)。
    context: rootDir,
    // 出口
    output: {
        path: distDir,
        filename: 'js/[name].[fullhash:7].js',
        publicPath: './',
        sourceMapFilename: 'sourcemaps/[file].map[query]'
    },
    amd: false,
    profile: false,
    parallelism: 100,
    infrastructureLogging: {
        level: 'error'
    },
    // stats: 'verbose',
    stats: 'errors-warnings',
    // stats: 'errors-warnings',
    // 解析
    resolve: {
        // 别名
        alias: {
            '@': srcDir
        },
        // 模块加载路径
        modules: [
            //
            resolve(cliDir, 'node_modules'),
            'node_modules'
        ],
        fallback: {
            assert: requireResolve(import.meta.url, 'assert'),
            buffer: requireResolve(import.meta.url, 'buffer'),
            // console: requireResolve(import.meta.url, 'console-browserify'),
            // constants: requireResolve(import.meta.url, 'constants-browserify'),
            crypto: requireResolve(import.meta.url, 'crypto-browserify'),
            domain: requireResolve(import.meta.url, 'domain-browser'),
            // events: requireResolve(import.meta.url, 'events'),
            http: requireResolve(import.meta.url, 'stream-http'),
            https: requireResolve(import.meta.url, 'https-browserify'),
            os: requireResolve(import.meta.url, 'os-browserify'),
            path: requireResolve(import.meta.url, 'path-browserify'),
            // punycode: requireResolve(import.meta.url, 'punycode'),
            process: requireResolve(import.meta.url, 'process/browser'),
            // querystring: requireResolve(import.meta.url, 'querystring-es3'),
            stream: requireResolve(import.meta.url, 'stream-browserify'),
            // string_decoder: requireResolve(import.meta.url, 'string_decoder'),
            sys: requireResolve(import.meta.url, 'util'),
            // timers: requireResolve(import.meta.url, 'timers-browserify'),
            // tty: requireResolve(import.meta.url, 'tty-browserify'),
            // url: requireResolve(import.meta.url, 'url'),
            util: requireResolve(import.meta.url, 'util')
            // vm: requireResolve(import.meta.url, 'vm-browserify'),
            // zlib: requireResolve(import.meta.url, 'browserify-zlib')
        }
    },
    // loader加载路径
    resolveLoader: {
        modules: [
            //
            resolve(cliDir, 'yicode'),
            resolve(cliDir, 'yicode', 'webpack'),
            resolve(cliDir, 'node_modules'),
            'node_modules'
        ]
    },
    watch: false,
    watchOptions: {
        ignored: ['**/.cache/**/*', '**/node_modules', '**/routes.js'],
        aggregateTimeout: 600,
        poll: 1000
    },
    // 外部扩展
    externals: yicodeConfig.webpack.externals,
    // node
    node: {
        global: true
    },
    //
    performance: {
        hints: 'warning',
        maxEntrypointSize: 1024 * 1024 * 50,
        maxAssetSize: 1024 * 1024 * 30
    },
    // 优化
    optimization: {
        // 运行时
        // runtimeChunk: {
        //     name: "runtime",
        // },
    },
    module: {
        // unsafeCache: process.env.NODE_MODE === 'production' ? false : true,
        rules: [
            {
                test: /\.css$/,
                use: [
                    //
                    _loaderStyleConfig,
                    _loaderCssConfig,
                    _loaderPostCssConfig
                ],
                sideEffects: true
            },
            {
                test: /\.scss$/,
                use: [
                    //
                    _loaderStyleConfig,
                    _loaderCssConfig,
                    _loaderPostCssConfig,
                    _loaderSassConfig,
                    _loaderSassResourcesConfig
                ],
                sideEffects: true
            },
            {
                test: /\.m?js$/,
                use: [_loaderBabelConfig],
                exclude: {
                    and: [/node_modules/],
                    not: []
                }
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader'
                    }
                ]
            },
            {
                resourceQuery: /blockType=route/,
                use: [_loaderRouteConfig]
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'videos/[hash][ext][query]'
                }
            },
            {
                test: /\.(md)$/,
                type: 'asset/source'
            }
            // TODO: 添加svg和雪碧图的相关loader
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(srcDir, 'static'),
                    to: resolve(distDir, 'static')
                }
            ]
        }),
        // new WindiCSSWebpackPlugin(),
        new AutoRoutePlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[fullhash:7].css'
        }),
        new HtmlWebpackPlugin({
            minify: false,
            template: resolve(srcDir, 'tpls', 'index.html')
        }),
        new VueLoaderPlugin(),
        new ProgressBarPlugin(),
        new Webpack.ProvidePlugin(yicodeConfig.webpack.providePlugin)
    ]
};

/**
 * 设置环境变量文件
 * [修改/新增/删除]环境变量时，自动更新其值，无需重新启动yicode
 */
let envFilePath = resolve(srcDir, 'env', process.env.NODE_ENV_FILE + '.js');
webpackConfigCommon.plugins.push(
    new Webpack.DefinePlugin({
        YICODE_ENV: Webpack.DefinePlugin.runtimeValue(
            function getRuntimeValue() {
                let envFileHash = ImportFresh(envFilePath);
                return JSON.stringify(envFileHash);
            },
            {
                fileDependencies: [
                    //
                    envFilePath,
                    resolve(rootDir, 'yicode.config.js')
                ]
            }
        )
    })
);

// 导出通用配置
export default webpackConfigCommon;
