// 导入模块
let path = require('path');
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let shell = require('shelljs');
let { table } = require('table');
let FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
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

// 使用产品模式
shell.env['NODE_MODE'] = 'production';

async function runProduction() {
    // 是否启动分析模式
    shell.env['NODE_ANALYZER'] = promptParams.isAnalyzer;

    // 选择的环境变量文件
    shell.env['NODE_ENV_FILE'] = promptParams.envFile;

    let webpackConfig = require(path.join(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.build.js'));

    // 追加友好错误提示插件
    friendlyErrorsConfig.compilationSuccessInfo.messages.push(`项目编译成功！！！`);
    friendlyErrorsConfig.compilationSuccessInfo.notes.unshift('友情提示：[ 请将 /dist 目录下的文件发布到服务器 ]');
    webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin(friendlyErrorsConfig));

    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err);
        } else {
            // let fileds = [
            //     //
            //     'name',
            //     'startTime',
            //     'endTime',
            //     'bail',
            //     'profile',
            //     'errors'
            // ];
            // let result = _.pick(stats.compilation, fileds);
            // console.log(result);
        }
    });
}
function main(options) {
    promptParams = _.merge(promptParams, options);
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
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        name: 'isAnalyzer',
                        message: '是否启动分析模式？（默认：否）',
                        default: false
                    }
                ])
                .then((answer) => {
                    promptParams = _.merge(promptParams, answer);
                    // 开发脚本
                    runProduction();
                });
        });
}

module.exports = main;
