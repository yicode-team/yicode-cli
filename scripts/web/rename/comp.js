// 自带模块
let path = require('path');
// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let shell = require('shelljs');
let ora = require('ora');
let chalk = require('chalk');
let { table } = require('table');
let tool = require('../tool.js');
// 配置相关
let myConfig = require('../../yicode/yicode.paths.js');
let yicodePackage = require('../../package.json');
let yicodeConfig = require('../../yicode/yicode.config.js');
let rootFileNames = [''];
module.exports = async function build(cmd) {
    let spinner = ora();
    let compNames = tool.getNames(cmd.comp);
    let newCompNames = tool.getNames(cmd.newComp);
    let compFilePath = path.join(myConfig.srcDir, 'comps', compNames.camelCaseName + '.vue');
    if (fs.existsSync(compFilePath) === false) {
        spinner.warn(chalk.green('全局组件不存在'));
        return;
    } else {
        let compFileData = fs.readFileSync(compFilePath, { encoding: 'utf-8' });
        let newCompFileData = compFileData
            // 替换css样式
            .replace(
                //
                new RegExp('comp-' + compNames.kebabCaseName, 'g'),
                'comp-' + newCompNames.kebabCaseName
            )
            // 替换组件名
            .replace(
                //
                new RegExp('[\'"]' + compNames.startCaseName + '[\'"],', 'g'),
                "'" + newCompNames.startCaseName + "',"
            )
            // 替换组件默认内容
            .replace(
                //
                new RegExp(compNames.kebabCaseName, 'g'),
                newCompNames.kebabCaseName
            );
        fs.writeFileSync(compFilePath, newCompFileData);
        spinner.succeed(chalk.green('重命名全局组件成功'));
    }
};
