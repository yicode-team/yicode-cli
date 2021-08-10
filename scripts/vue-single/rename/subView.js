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
    let subViewNames = tool.getNames(cmd.subView);
    let subViewDirectory = path.join(myConfig.srcDir, 'pages', pageNames.camelCaseName, 'subViews', subViewNames.camelCaseName);
    // 如果重命名子视图
    if (cmd.newSubView) {
        let newSubViewNames = tool.getNames(cmd.newSubView);
        let subViewFilePath = path.join(subViewDirectory, 'index.vue');
        let subViewRouteFilePath = path.join(subViewDirectory, 'routeView.js');
        if (fs.existsSync(subViewFilePath) === false) {
            spinner.warn(chalk.green('子视图不存在'));
            return;
        } else {
            // 页面数据
            let subViewFileData = fs.readFileSync(subViewFilePath, { encoding: 'utf-8' });
            let newSubViewFileData = subViewFileData
                // 重名命子视图css类名
                .replace(
                    //
                    new RegExp('page-' + pageNames.kebabCaseName + '_' + subViewNames.kebabCaseName, 'g'),
                    'page-' + pageNames.kebabCaseName + '_' + newSubViewNames.kebabCaseName
                )
                // 重命名子视图组件名
                .replace(
                    //
                    new RegExp('[\'"]' + pageNames.startCaseName + subViewNames.startCaseName + '[\'"],', 'g'),
                    "'" + pageNames.startCaseName + newSubViewNames.startCaseName + "',"
                )
                // 重命名子视图页面默认内容
                .replace(
                    //
                    new RegExp('page-' + pageNames.kebabCaseName + ' sub-view-' + subViewNames.kebabCaseName, 'g'),
                    'page-' + pageNames.kebabCaseName + ' sub-view-' + newSubViewNames.kebabCaseName
                );
            fs.writeFileSync(subViewFilePath, newSubViewFileData);
            spinner.succeed(chalk.green('重命名子视图成功'));
        }

        if (fs.existsSync(subViewRouteFilePath) === false) {
            spinner.warn(chalk.green('子视图路由不存在'));
            return;
        } else {
            // 页面数据
            let subViewRouteFileData = fs.readFileSync(subViewRouteFilePath, { encoding: 'utf-8' });
            let newSubViewRouteFileData = subViewRouteFileData
                //
                .replace(
                    //
                    new RegExp('subViews/' + subViewNames.camelCaseName, 'g'),
                    'subViews/' + newSubViewNames.camelCaseName
                )
                .replace(
                    //
                    new RegExp('[\'"]sv-' + subViewNames.kebabCaseName + '[\'"],', 'g'),
                    "'sv-" + newSubViewNames.kebabCaseName + "',"
                );
            fs.writeFileSync(subViewRouteFilePath, newSubViewRouteFileData);
            spinner.succeed(chalk.green('重命名子视图路由成功'));
        }
        return;
    }

    // 如果重命名子视图组件
    if (cmd.comp && cmd.newComp) {
        let compNames = tool.getNames(cmd.comp);
        let newCompNames = tool.getNames(cmd.newComp);
        let compDirectory = path.join(subViewDirectory, 'comps');
        let compFilePath = path.join(compDirectory, compNames.camelCaseName + '.vue');
        if (fs.existsSync(compFilePath) === false) {
            spinner.warn(chalk.green('子视图组件不存在'));
            return;
        } else {
            let compFileData = fs.readFileSync(compFilePath, { encoding: 'utf-8' });
            let newCompFileData = compFileData
                // 替换css类名
                .replace(
                    //
                    new RegExp('comp-' + pageNames.kebabCaseName + '_' + subViewNames.kebabCaseName + '_' + compNames.kebabCaseName, 'g'),
                    'comp-' + pageNames.kebabCaseName + '_' + subViewNames.kebabCaseName + '_' + newCompNames.kebabCaseName
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
                    new RegExp('page-' + pageNames.kebabCaseName + ' sub-view-' + subViewNames.kebabCaseName + ' comp-' + compNames.kebabCaseName, 'g'),
                    'page-' + pageNames.kebabCaseName + ' sub-view-' + subViewNames.kebabCaseName + ' comp-' + newCompNames.kebabCaseName
                );
            fs.writeFileSync(compFilePath, newCompFileData);
            spinner.succeed(chalk.green('重命名子视图组件成功'));
        }
    }
};
