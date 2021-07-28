// 自带模块
let path = require('path');
// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let chalk = require('chalk');
let ora = require('ora');
let tool = require('../tool.js');
// 配置相关
let myConfig = require('../../yicode/yicode.paths.js');
let yicodePackage = require('../../package.json');
let yicodeConfig = require('../../yicode/yicode.config.js');
module.exports = async function newComp(cmd) {
    let spinner = ora();
    let dataParams = {
        names: tool.getNames(cmd.directive)
    };
    // 全局组件目录
    let currentDirectory = path.join(myConfig.srcDir, 'directives', dataParams.names.lowerCaseName);
    if (fs.existsSync(currentDirectory) === false) {
        fs.ensureDirSync(currentDirectory);
        // 创建全局组件
        let directiveFilePath = path.join(currentDirectory, 'index.js');
        let directiveFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'directiveTemplate.js')))(dataParams);
        fs.outputFileSync(directiveFilePath, directiveFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局指令创建成功'));

        // 创建全局组件说明
        let readmeFilePath = path.join(currentDirectory, 'readme.md');
        let readmeFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'readme.js')))(dataParams);
        fs.outputFileSync(readmeFilePath, readmeFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局指令说明创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.red(dataParams.names.lowerCaseName) + ' 全局指令目录已存在'));
    }
};
