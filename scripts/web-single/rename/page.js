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
module.exports = async function build(cmd) {
    let spinner = ora();
    let pageNames = tool.getNames(cmd.page);
    let pageDirectory = path.join(myConfig.srcDir, 'pages', pageNames.camelCaseName);
    // 如果重命名页面
    if (cmd.newPage) {
        let newPageNames = tool.getNames(cmd.newPage);
        let newPageDirectory = path.join(myConfig.srcDir, 'pages', newPageNames.camelCaseName);
        let pageFilePath = path.join(pageDirectory, 'index.vue');
        let routeFilePath = path.join(pageDirectory, 'route.js');
        if (fs.existsSync(newPageDirectory) === true) {
            spinner.warn(chalk.green(chalk.red('[ src/pages/' + newPageNames.camelCaseName + ' ] ') + '新页面目录已存在'));
            return;
        }
        if (fs.existsSync(pageFilePath) === false) {
            spinner.warn(chalk.green(chalk.red('[ src/pages/' + pageNames.camelCaseName + '/index.vue ] ') + '页面不存在'));
            return;
        }
        if (fs.existsSync(routeFilePath) === false) {
            spinner.warn(chalk.green(chalk.red('[ src/pages/' + pageNames.camelCaseName + '/route.js ] ') + '页面路由不存在'));
            return;
        }
        let pageFileData = fs.readFileSync(pageFilePath, { encoding: 'utf-8' });
        let newPageFileData = pageFileData
            // 重名命css
            .replace(
                //
                new RegExp('page-' + pageNames.kebabCaseName, 'g'),
                'page-' + newPageNames.kebabCaseName
            )
            // 重命名组件名
            .replace(
                //
                new RegExp('[\'"]' + pageNames.startCaseName + '[\'"],', 'g'),
                "'" + newPageNames.startCaseName + "',"
            )
            // 重名命页面默认内容
            .replace(
                //
                new RegExp(pageNames.kebabCaseName, 'g'),
                newPageNames.kebabCaseName
            );
        if (fs.writeFileSync(pageFilePath, newPageFileData)) {
            spinner.succeed(chalk.green('重命名页面成功'));
        } else {
            spinner.fail(chalk.green('重命名页面失败'));
        }

        // 页面数据
        let routeFileData = fs.readFileSync(routeFilePath, { encoding: 'utf-8' });
        let newRouteFileData = routeFileData
            // 重命名路径
            .replace(
                //
                new RegExp('pages/' + pageNames.camelCaseName, 'g'),
                'pages/' + newPageNames.camelCaseName
            )
            // 重名命路由
            .replace(
                //
                new RegExp('/' + pageNames.kebabCaseName, 'g'),
                '/' + newPageNames.kebabCaseName
            );
        if (fs.writeFileSync(routeFilePath, newRouteFileData)) {
            spinner.succeed(chalk.green('重命名页面路由成功'));
        } else {
            spinner.fail(chalk.green('重命名页面路由失败'));
        }

        if (fs.moveSync(pageDirectory, newPageDirectory)) {
            spinner.succeed(chalk.green('重命名页面目录成功'));
        } else {
            spinner.fail(chalk.green('重命名页面目录失败'));
        }
    } else if (cmd.comp && cmd.newComp) {
        // 如果重命名页面组件
        let compNames = tool.getNames(cmd.comp);
        let newCompNames = tool.getNames(cmd.newComp);
        let compDirectory = path.join(myConfig.srcDir, 'pages', pageNames.camelCaseName, 'comps');
        let compFilePath = path.join(compDirectory, compNames.camelCaseName + '.vue');
        if (fs.existsSync(compFilePath) === false) {
            spinner.warn(chalk.green('页面组件不存在'));
            return;
        }
        let compFileData = fs.readFileSync(compFilePath, { encoding: 'utf-8' });
        let newCompFileData = compFileData
            // 替换css类名
            .replace(
                //
                new RegExp('comp-' + pageNames.kebabCaseName + '_' + compNames.kebabCaseName, 'g'),
                'comp-' + pageNames.kebabCaseName + '_' + newCompNames.kebabCaseName
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
                new RegExp('page-' + pageNames.kebabCaseName + ' comp-' + compNames.kebabCaseName, 'g'),
                'page-' + pageNames.kebabCaseName + ' comp-' + newCompNames.kebabCaseName
            );
        fs.writeFileSync(compFilePath, newCompFileData);
        spinner.succeed(chalk.green('重命名页面组件成功'));
    } else {
        spinner.warn(chalk.green('页面重命名参数不合法'));
    }
};
