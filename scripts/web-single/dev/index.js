// 自带模块
let path = require('path');

// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let { merge } = require('webpack-merge');
let portfinder = require('portfinder');
let FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
let updateNotifier = require('update-notifier');
let webpackDevServer = require('webpack-dev-server');
let shell = require('shelljs');
let { table } = require('table');
let inquirer = require('inquirer');

// 配置相关
let yicodePaths = require('../../../yicode/helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

// 提示参数收集
let promptParams = {};

// 默认使用开发者模式
shell.env['NODE_MODE'] = 'development';

// 导出函数
async function runDevelopment() {
    // 选择的环境变量文件
    shell.env['NODE_ENV_FILE'] = promptParams.envFile;

    // 开发环境的webpack配置参数
    let webpackConfig = require(path.join(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.dev.js'));

    // 默认的devServer配置参数
    let defaultDevServer = require('./devServer.js');

    // 合并开发服务配置参数
    let devServerConfig = merge(defaultDevServer, yicodeConfig.devServer, { devMiddleware: { writeToDisk: promptParams.isWriteToDisk } });

    // 确保port是有值的
    if (!devServerConfig.port) {
        devServerConfig.port = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });
    }

    // 判断协议类型
    let protocol = devServerConfig.https === true ? 'https' : 'http';

    // 追加开发环境插件
    webpackConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`应用已启动：${protocol}://${devServerConfig.host}:${devServerConfig.port}`],
                notes: ['使用文档请访问网址 [ https://yicode.site ]']
            }
        })
    );

    // 模块热替换
    // webpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig);
    let compiler = webpack(webpackConfig);
    let server = new webpackDevServer(compiler, devServerConfig);

    server.listen(devServerConfig.port, devServerConfig.host, () => {
        // console.log(`开发环境已启动：${protocol}://${devServerConfig.host}:${port}`);
    });
}
function main(options) {
    promptParams = _.merge(promptParams, options);
    // 通知更新
    updateNotifier({ pkg: yicodePackage.cli }).notify();
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'isWriteToDisk',
                message: '是否将打包文件存放到本地？（默认：否）',
                default: false
            }
        ])
        .then((answer) => {
            promptParams = _.merge(promptParams, answer);

            // 动态读取环境变量文件;
            let envFiles = fs.readdirSync(path.resolve(yicodePaths.srcDir, 'env')).map((fileName) => {
                return {
                    value: path.basename(fileName, '.env'),
                    name: fileName
                };
            });
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'envFile',
                        choices: envFiles,
                        message: '选择使用的环境变量文件'
                    }
                ])
                .then((answer) => {
                    promptParams = _.merge(promptParams, answer);
                    // 开发脚本
                    runDevelopment();
                });
        });
}

module.exports = main;
