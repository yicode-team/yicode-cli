// 内部模块
let path = require('path');

// 第三方模块
let Webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let VueLoaderPlugin = require('vue-loader/lib/plugin');
let { merge } = require('webpack-merge');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');
let Dotenv = require('dotenv-webpack');

//  配置文件
let yicodePaths = require('../helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

//  loader配置文件
let dirLoader = path.resolve(yicodePaths.cliDir, 'yicode', 'loader');
let _loaderPostCssConfig = require(path.resolve(dirLoader, 'postcss-loader.config.js'));
let _loaderBabelConfig = require(path.resolve(dirLoader, 'babel-loader.config.js'));
let _loaderCssConfig = require(path.resolve(dirLoader, 'css-loader.config.js'));
let _loaderSassConfig = require(path.resolve(dirLoader, 'sass-loader.config.js'));
let _loaderStyleConfig = require(path.resolve(dirLoader, 'style-loader.config.js'));
let _loaderSassResourcesConfig = require(path.resolve(dirLoader, 'sass-resources-loader.config.js'));

// plugin 配置文件
// let _pluginProvideConfig = require("./plugin/provide-plugin.config.js");

// 导出webpack通用配置
let webpackConfigCommon = {
    // 编译模式
    mode: process.env.NODE_MODE,
    name: 'yicode-cli',
    // TODO: 搞清楚这个参数的含义 2021.2.13
    profile: false,

    // 编译记录文件记录
    recordsPath: path.join(yicodePaths.cacheDir, 'records.json'),
    // 入口
    entry: path.join(yicodePaths.srcDir, 'main.js'),
    // 基础目录，绝对路径，用于从配置中解析入口点(entry point)和 加载器(loader)。
    context: yicodePaths.rootDir,
    // 出口
    output: {
        path: yicodePaths.distDir,
        filename: 'js/[name].[fullhash:7].js',
        publicPath: './',
        clean: true
    },
    // 解析
    resolve: {
        // 别名
        alias: {
            '@': yicodePaths.srcDir
        },
        // 模块加载路径
        modules: [
            //
            path.join(yicodePaths.cliDir, 'node_modules'),
            path.join(__dirname, 'node_modules'),
            'node_modules'
        ],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify')
        }
    },
    // loader加载路径
    resolveLoader: {
        modules: [
            //
            path.join(yicodePaths.cliDir, 'yicode'),
            path.join(yicodePaths.cliDir, 'node_modules'),
            'node_modules'
        ]
    },
    infrastructureLogging: {
        // level: "info",
        level: 'verbose'
    },
    // stats: "errors-warnings",
    stats: {
        assets: false,
        assetsSort: '!size',
        builtAt: false,
        moduleAssets: false,
        cached: false,
        assetsSpace: 1,
        modulesSpace: 1,
        cachedModules: false,
        runtimeModules: false,
        dependentModules: false,
        groupAssetsByChunk: false,
        groupAssetsByEmitStatus: false,
        groupAssetsByInfo: false,
        groupModulesByAttributes: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        chunksSort: 'name',
        colors: false,
        depth: false,
        entrypoints: false,
        env: false,
        orphanModules: false,
        errors: false,
        errorDetails: false,
        errorStack: false,
        hash: false,
        logging: 'verbose',
        loggingTrace: false,
        modules: false,
        modulesSort: '!size',
        moduleTrace: false,
        outputPath: false,
        performance: false,
        providedExports: false,
        errorsCount: false,
        warningsCount: false,
        publicPath: false,
        reasons: false,
        relatedAssets: false,
        source: false,
        timings: false,
        usedExports: false,
        version: false,
        chunkGroupAuxiliary: false,
        chunkGroupChildren: false,
        chunkGroupMaxAssets: 1,
        warnings: false
    },
    // 外部扩展
    externals: yicodeConfig.externals,
    // node
    node: {
        global: false,
        __filename: true,
        __dirname: true
    },
    //
    performance: {
        hints: 'warning',
        maxEntrypointSize: 1024 * 1024 * 20,
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
        generator: {},
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
                test: /\.js$/,
                use: [_loaderBabelConfig],
                exclude: /node_modules/
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
                test: /\.(png|jpg|gif|jpeg|webp)$/,
                type: 'asset',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
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
        //
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(yicodePaths.srcDir, 'static'),
                    to: path.join(yicodePaths.distDir, 'static')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[fullhash:7].css'
        }),
        new HtmlWebpackPlugin({
            minify: false,
            template: path.join(yicodePaths.srcDir, 'tpls', 'index.html')
        }),
        new VueLoaderPlugin(),
        new ProgressBarPlugin(),
        new Webpack.ProvidePlugin(yicodeConfig.providePlugin)
    ]
};
if (process.env.NODE_ENV_FILE && process.env.NODE_ENV_FILE !== 'undefined') {
    webpackConfigCommon.plugins.push(
        new Dotenv({
            path: path.join(yicodePaths.srcDir, 'env', process.env.NODE_ENV_FILE + '.env'),
            safe: false,
            allowEmptyValues: true,
            systemvars: true,
            silent: false,
            defaults: false
        })
    );
} else {
    webpackConfigCommon.plugins.push(
        new Dotenv({
            path: path.join(yicodePaths.srcDir, 'env', process.env.NODE_MODE + '.env'),
            safe: false,
            allowEmptyValues: true,
            systemvars: true,
            silent: false,
            defaults: false
        })
    );
}
module.exports = webpackConfigCommon;
