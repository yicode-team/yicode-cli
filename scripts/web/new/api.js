// TODO: 增加多级目录组件
// 案例：yicode new --comp a/b/c.vue 创建多级目录组件
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
let yicodeConfig = require(path.join(myConfig.webpackDir, 'yicode.config.js'));
let aliasObject = require('../../yicode/config/alias.js');
let aliasNames = aliasObject[yicodeConfig.type || 'init'];
module.exports = async function newComp(cmd) {
    let spinner = ora();
    let dataParams = {
        aliasNames: aliasNames,
        names: tool.getNames(cmd.api)
    };
    // 全局组件目录
    let apiDirectory = path.join(myConfig.srcDir, 'apis', dataParams.names.lowerCaseName);
    if (fs.existsSync(apiDirectory) === false) {
        fs.ensureDirSync(apiDirectory);
        // 创建全局组件
        let apiFilePath = path.join(apiDirectory, 'index.js');
        let apiFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'api.js')))(dataParams);
        fs.outputFileSync(apiFilePath, apiFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局接口创建成功'));

        // 创建全局组件说明
        let readmeFilePath = path.join(apiDirectory, 'readme.md');
        let readmeFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'readme.js')))(dataParams);
        fs.outputFileSync(readmeFilePath, readmeFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局接口说明书创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.red(dataParams.names.lowerCaseName) + ' 全局接口已存在'));
    }
};
