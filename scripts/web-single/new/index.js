let path = require('path');
let inquirer = require('inquirer');
let _ = require('lodash');
let chalk = require('chalk');

// 配置相关
let yicodePaths = require('../../../yicode/helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

// 提示参数收集
let promptParams = {};

// 启动函数
function main(options) {
    promptParams = _.merge(promptParams, options);
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'newType',
                choices: [
                    {
                        name: yicodeUtils.print(_.padEnd('page', 14, ' ')) + chalk.cyanBright(' 创建新页面'),
                        value: 'page'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('comp', 14, ' ')) + chalk.cyanBright(' 创建全局组件'),
                        value: 'comp'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('filter', 14, ' ')) + chalk.cyanBright(' 创建全局过滤器'),
                        value: 'filter'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('directive', 14, ' ')) + chalk.cyanBright(' 创建全局指令'),
                        value: 'directive'
                    }
                ],
                message: '请选择需要创建的类型'
            }
        ])
        .then((answer) => {
            promptParams = _.merge(promptParams, answer);
            require(path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.projectType, promptParams.command, promptParams.newType + '.js'))(promptParams);
        });
}

module.exports = main;
