// 内部模块
import path from 'path';
import fs from 'fs-extra';

// 第三方模块
import Webpack from 'webpack';
import * as _ from 'lodash-es';
import { merge as webpackMerge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ImportFresh from 'import-fresh';
import Dotenv from 'dotenv';
import DotenvExpand from 'dotenv-expand';

//  配置文件
import * as yicodePaths from '../paths.js';
import * as yicodePkgs from '../package.js';
import * as yicodeUtils from '../utils.js';
import { yicodeConfig } from '../config.js';

//  loader配置文件
import _loaderPostCssConfig from '../loader/postcss-loader.config.js';
import _loaderBabelConfig from '../loader/babel-loader.config.js';
import _loaderCssConfig from '../loader/css-loader.config.js';
import _loaderSassConfig from '../loader/sass-loader.config.js';
import _loaderStyleConfig from '../loader/style-loader.config.js';
import _loaderRouteConfig from '../loader/route-loader.config.js';

// plugin 配置文件
// let _pluginProvideConfig = require("./plugin/provide-plugin.config.js");

let env = {};
const envFiles = [
    //
    `.env.${process.env.NODE_ENV_FILE}.local`,
    `.env.${process.env.NODE_ENV_FILE}`,
    `.env.local`,
    `.env`
];

// 把环境变量已有的YICODE_开头的变量搜集
for (const key in process.env) {
    if (key.startsWith('YICODE_') && env[key] === undefined) {
        env[key] = process.env[key];
    }
}

// 按照环境变量文件的优先级加载环境变量
for (let envFile of envFiles) {
    let envPath = path.resolve(yicodePaths.envDir, envFile);
    if (fs.existsSync(envPath)) {
        let parsed = Dotenv.parse(fs.readFileSync(envPath, 'utf-8'));
        let envVars = DotenvExpand.expand({
            parsed,
            ignoreProcessEnv: false
        });

        for (const [key, value] of Object.entries(envVars.parsed)) {
            if (key.startsWith('YICODE_') && env[key] === undefined) {
                env[key] = value;
            }
        }
    }
}

// 导出webpack通用配置
let currentConfig = {
    name: 'yicode-cli',
    // 打包发生错误时停止打包
    bail: false,
    // 缓存，生产模式禁用
    cache: false,
    // 编译模式
    mode: 'development',
    // mode: 'production',
    // 入口
    entry: path.resolve(yicodePaths.srcDir, 'main.js'),
    // 基础目录，绝对路径，用于从配置中解析入口点(entry point)和 加载器(loader)。
    context: yicodePaths.rootDir,
    // 出口
    output: {
        path: yicodePaths.distDir,
        filename: 'js/[name].[fullhash:7].js',
        publicPath: './',
        sourceMapFilename: 'sourcemaps/[file].map[query]'
    },
    target: 'web',
    amd: false,
    profile: false,
    parallelism: 100,
    infrastructureLogging: {
        level: 'warn'
    },
    // stats: 'verbose',
    stats: 'errors-warnings',
    // stats: 'errors-warnings',
    // 解析
    resolve: {
        // 别名
        alias: {
            '@': yicodePaths.srcDir
        },
        // 模块加载路径
        modules: [
            //
            path.resolve(yicodePaths.cliDir, 'node_modules'),
            'node_modules'
        ],
        fallback: {
            assert: false,
            buffer: false,
            console: false,
            constants: false,
            crypto: false,
            domain: false,
            events: false,
            http: false,
            https: false,
            os: false,
            path: false,
            punycode: false,
            process: false,
            querystring: false,
            stream: false,
            string_decoder: false,
            sys: false,
            timers: false,
            tty: false,
            url: false,
            util: false,
            vm: false,
            zlib: false
        }
    },
    // loader加载路径
    resolveLoader: {
        modules: [
            //
            path.resolve(yicodePaths.cliDir, 'yicode'),
            path.resolve(yicodePaths.cliDir, 'yicode', 'webpack'),
            path.resolve(yicodePaths.cliDir, 'node_modules'),
            'node_modules'
        ]
    },
    watch: false,
    watchOptions: {
        ignored: ['**/.cache/**/*', '**/node_modules'],
        aggregateTimeout: 600,
        poll: 1000
    },
    // 外部扩展
    externals: {},
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
                    _loaderSassConfig
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
                    from: path.resolve(yicodePaths.srcDir, 'static'),
                    to: path.resolve(yicodePaths.distDir, 'static')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[fullhash:7].css'
        }),
        new HtmlWebpackPlugin({
            minify: false,
            template: path.resolve(yicodePaths.srcDir, 'tpls', 'index.html')
        }),
        new VueLoaderPlugin(),
        new ProgressBarPlugin(),
        new Webpack.DefinePlugin({
            'import.meta.env': JSON.stringify(env)
        }),
        new Webpack.ProvidePlugin(yicodeConfig?.webpackConfig?.providePlugin || {})
    ]
};

// 合并配合文件，并排除掉无用的字段
const webpackConfigCommon = webpackMerge(currentConfig, _.omit(yicodeConfig.webpackConfig, ['plugins', 'providePlugin']));

// 导出通用配置
export { webpackConfigCommon };
