// TODO: 增加多级目录组件
// 案例：yicode new --comp a/b/c.vue 创建多级目录组件
// TODO: 创建局部组件，也需要用文件夹包裹
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
        names: tool.getNames(cmd.comp),
        aliasNames: aliasNames
    };
    // 全局组件目录
    let compDirectory = path.join(myConfig.srcDir, 'components', dataParams.names.lowerCaseName);
    if (fs.existsSync(compDirectory) === false) {
        fs.ensureDirSync(compDirectory);
        // 创建全局组件
        let compFilePath = path.join(compDirectory, 'index.vue');
        let compFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'compHtml.js')))(dataParams);
        fs.outputFileSync(compFilePath, compFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局组件创建成功'));

        // 创建全局组件说明
        let readmeFilePath = path.join(compDirectory, 'readme.md');
        let readmeFileData = _.template(require(path.join(myConfig.webpackDir, 'template', 'readme.js')))(dataParams);
        fs.outputFileSync(readmeFilePath, readmeFileData);
        spinner.succeed(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局组件说明书创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.blue(dataParams.names.lowerCaseName) + ' 全局组件已存在'));
    }
};
