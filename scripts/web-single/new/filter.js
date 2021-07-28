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
        names: tool.getNames(cmd.filter)
    };
    console.log(dataParams);
    // 全局过滤器目录
    let currentDirectory = path.join(myConfig.srcDir, 'filters', dataParams.names.lowerCaseName);
    if (fs.existsSync(currentDirectory) === false) {
        fs.ensureDirSync(currentDirectory);
        // 创建全局组件
        let filterFilePath = path.join(currentDirectory, 'index.js');
        let filterFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'filterTemplate.js')))(dataParams);
        fs.outputFileSync(filterFilePath, filterFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局过滤器创建成功'));

        // 创建全局组件说明
        let readmeFilePath = path.join(currentDirectory, 'readme.md');
        let readmeFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'readme.js')))(dataParams);
        fs.outputFileSync(readmeFilePath, readmeFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局过滤器说明书创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.red(dataParams.names.lowerCaseName) + ' 全局过滤器已存在'));
    }
};
