// 第三方模块
let fs = require('fs-extra');
let chalk = require('chalk');
let ora = require('ora');
// 配置相关
let myConfig = require('../../yicode/yicode.paths.js');
let tool = require('../tool.js');
module.exports = async function inityicodeTemplateAdmin() {
    let spinner = ora();
    spinner.start(chalk.green('yicode-template-admin模板下载中...'));
    try {
        fs.removeSync(myConfig.tempDir);
        fs.ensureDirSync(myConfig.tempDir);
        await tool.downloadProject('https://gitee.com:banshiweichen/yicode-template-admin#master');
        fs.copySync(myConfig.tempDir, myConfig.rootDir, { overwrite: true });
        fs.removeSync(myConfig.tempDir);
        spinner.succeed(chalk.green('yicode-template-admin模板下载成功'));
    } catch (err) {
        spinner.fail(chalk.red('yicode-template-admin模板下载失败'));
        spinner.stop();
        console.log(err);
    }
};
