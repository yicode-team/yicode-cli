// 自带模块
let path = require('path');

// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let fastGlob = require('fast-glob');
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
// 友好错误插件配置
let friendlyErrorsConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'plugin', 'friendly-errors.config.js'));

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
    let devServerConfig = merge(defaultDevServer, yicodeConfig.devServer);

    // 如果port没有值，则从8000 - 9000端口中选择一个
    if (!devServerConfig.port) {
        devServerConfig.port = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });
    }

    // 判断协议类型
    let protocol = devServerConfig.https === true ? 'https' : 'http';

    // 追加友好错误提示插件
    friendlyErrorsConfig.compilationSuccessInfo.messages.push(`应用已启动：${protocol}://${devServerConfig.host}:${devServerConfig.port}`);
    friendlyErrorsConfig.compilationSuccessInfo.notes.unshift('官方文档：[ https://yicode.site ]');
    webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin(friendlyErrorsConfig));

    let compiler = webpack(webpackConfig);
    let server = new webpackDevServer(devServerConfig, compiler);

    server.startCallback(() => {
        // console.log("Running");
    });

    // server.listen(devServerConfig.port, devServerConfig.host, () => {
    // console.log(`开发环境已启动：${protocol}://${devServerConfig.host}:${port}`);
    // });
}
function main(options) {
    promptParams = _.merge(promptParams, options);
    // 通知更新
    updateNotifier({ pkg: yicodePackage.cli }).notify();

    // 动态读取环境变量文件;
    let envFiles = fastGlob
        .sync('*.js', {
            dot: false,
            absolute: false,
            cwd: path.resolve(yicodePaths.srcDir, 'env'),
            onlyFiles: true
        })
        .map((fileName) => {
            return {
                value: path.basename(fileName, '.js'),
                name: fileName
            };
        });
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'envFile',
                choices: envFiles,
                message: '请选择使用的环境变量文件'
            }
        ])
        .then((answer) => {
            promptParams = _.merge(promptParams, answer);
            runDevelopment();
        });
}

module.exports = main;
