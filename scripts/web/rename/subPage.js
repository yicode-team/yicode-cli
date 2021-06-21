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
    let pageNames = tool.getNames(cmd.page);
    let subPageNames = tool.getNames(cmd.subPage);
    let subPageDirectory = path.join(myConfig.srcDir, 'pages', pageNames.camelCaseName, 'subPages', subPageNames.camelCaseName);
    // 如果重命名子页面
    if (cmd.newSubPage) {
        let newSubPageNames = tool.getNames(cmd.newSubPage);
        let subPageFilePath = path.join(subPageDirectory, 'index.vue');
        let subPageRouteFilePath = path.join(subPageDirectory, 'routePage.js');
        if (fs.existsSync(subPageFilePath) === false) {
            spinner.warn(chalk.green('子页面不存在'));
            return;
        } else {
            // 页面数据
            let subPageFileData = fs.readFileSync(subPageFilePath, { encoding: 'utf-8' });
            let newSubPageFileData = subPageFileData
                // 重名命子页面css类名
                .replace(
                    //
                    new RegExp('page-' + pageNames.kebabCaseName + '_' + subPageNames.kebabCaseName, 'g'),
                    'page-' + pageNames.kebabCaseName + '_' + newSubPageNames.kebabCaseName
                )
                // 重命名子页面组件名
                .replace(
                    //
                    new RegExp('[\'"]' + pageNames.startCaseName + subPageNames.startCaseName + '[\'"],', 'g'),
                    "'" + pageNames.startCaseName + newSubPageNames.startCaseName + "',"
                )
                // 重命名子页面页面默认内容
                .replace(
                    //
                    new RegExp('page-' + pageNames.kebabCaseName + ' sub-page-' + subPageNames.kebabCaseName, 'g'),
                    'page-' + pageNames.kebabCaseName + ' sub-page-' + newSubPageNames.kebabCaseName
                );
            fs.writeFileSync(subPageFilePath, newSubPageFileData);
            spinner.succeed(chalk.green('重命名子页面成功'));
        }

        if (fs.existsSync(subPageRouteFilePath) === false) {
            spinner.warn(chalk.green('子页面路由不存在'));
            return;
        } else {
            // 页面数据
            let subPageRouteFileData = fs.readFileSync(subPageRouteFilePath, { encoding: 'utf-8' });
            let newSubPageRouteFileData = subPageRouteFileData
                //
                .replace(
                    //
                    new RegExp('subPages/' + subPageNames.camelCaseName, 'g'),
                    'subPages/' + newSubPageNames.camelCaseName
                )
                .replace(
                    //
                    new RegExp('[\'"]sp-' + subPageNames.kebabCaseName + '[\'"],', 'g'),
                    "'sp-" + newSubPageNames.kebabCaseName + "',"
                );
            fs.writeFileSync(subPageRouteFilePath, newSubPageRouteFileData);
            spinner.succeed(chalk.green('重命名子页面路由成功'));
        }
        return;
    }

    // 如果重命名子页面组件
    if (cmd.comp && cmd.newComp) {
        let compNames = tool.getNames(cmd.comp);
        let newCompNames = tool.getNames(cmd.newComp);
        let compDirectory = path.join(subPageDirectory, 'comps');
        let compFilePath = path.join(compDirectory, compNames.camelCaseName + '.vue');
        if (fs.existsSync(compFilePath) === false) {
            spinner.warn(chalk.green('子页面组件不存在'));
            return;
        } else {
            let compFileData = fs.readFileSync(compFilePath, { encoding: 'utf-8' });
            let newCompFileData = compFileData
                // 替换css类名
                .replace(
                    //
                    new RegExp('comp-' + pageNames.kebabCaseName + '_' + subPageNames.kebabCaseName + '_' + compNames.kebabCaseName, 'g'),
                    'comp-' + pageNames.kebabCaseName + '_' + subPageNames.kebabCaseName + '_' + newCompNames.kebabCaseName
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
                    new RegExp('page-' + pageNames.kebabCaseName + ' sub-page-' + subPageNames.kebabCaseName + ' comp-' + compNames.kebabCaseName, 'g'),
                    'page-' + pageNames.kebabCaseName + ' sub-page-' + subPageNames.kebabCaseName + ' comp-' + newCompNames.kebabCaseName
                );
            fs.writeFileSync(compFilePath, newCompFileData);
            spinner.succeed(chalk.green('重命名子页面组件成功'));
        }
    }
};
