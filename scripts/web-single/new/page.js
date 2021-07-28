// 自带模块
let path = require('path');

// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let chalk = require('chalk');
let ora = require('ora');

// 配置相关
let yicodePaths = require('../../../yicode/yicode.paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'package.json'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'yicode.config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'yicode.utils.js'));
let tool = require('../tool.js');

let aliasObject = require('../../yicode/config/alias.js');
let aliasNames = aliasObject[yicodeConfig.type || 'init'];

module.exports = async function newPage(cmd) {
    let spinner = ora();
    let pages = cmd.page.split('/');
    let pageParams = {
        names: {},
        aliasNames: aliasNames,
        path: yicodePaths.pageDir,
        // 小写短横线文件名数组
        lowerCaseNameRoute: [],
        lowerCaseNameRouteDot: '', // 点号拼接
        lowerCaseNameRouteBackslash: '', // 反斜杠拼接
        lowerCaseNameRoutePath: '', // 路径路径
        // 小驼峰文件名数组
        camelCaseNameRoute: [],
        camelCaseNameRouteDot: '',
        camelCaseNameRouteBackslash: '',
        camelCaseNameRoutePath: '',
        // 大驼峰文件名数组
        startCaseNameRoute: [],
        startCaseNameRouteDot: '',
        startCaseNameRouteBackslash: '',
        startCaseNameRoutePath: ''
    };
    pages.forEach(function Page(page) {
        // 页面参数
        pageParams.names = tool.getNames(page);
        // 当前页面路径
        pageParams.path = path.join(pageParams.path, pageParams.names.lowerCaseName);
        // 页面相对路径
        pageParams.lowerCaseNameRoute.push(pageParams.names.lowerCaseName);
        pageParams.camelCaseNameRoute.push(pageParams.names.camelCaseName);
        pageParams.startCaseNameRoute.push(pageParams.names.startCaseName);
        // 点号拼接
        pageParams.lowerCaseNameRouteDot = pageParams.lowerCaseNameRoute.join('.');
        pageParams.camelCaseNameRouteDot = pageParams.camelCaseNameRoute.join('.');
        pageParams.startCaseNameRouteDot = pageParams.startCaseNameRoute.join('.');
        // 反斜杠拼接
        pageParams.lowerCaseNameRouteBackslash = pageParams.lowerCaseNameRoute.join('/');
        pageParams.camelCaseNameRouteBackslash = pageParams.camelCaseNameRoute.join('/');
        pageParams.startCaseNameRouteBackslash = pageParams.startCaseNameRoute.join('/');
        // 路径路径拼接
        pageParams.lowerCaseNameRoutePath = '/' + pageParams.lowerCaseNameRouteBackslash;
        pageParams.camelCaseNameRoutePath = '/' + pageParams.camelCaseNameRouteBackslash;
        pageParams.startCaseNameRoutePath = '/' + pageParams.startCaseNameRouteBackslash;
        // 如果页面目录还不存在，则创建页面目录
        fs.ensureDirSync(pageParams.path);

        // 创建页面
        let htmlFilePath = path.join(pageParams.path, 'index.vue');
        if (fs.existsSync(htmlFilePath) === false) {
            let htmlFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'pageHtml.js')))(pageParams);
            fs.outputFileSync(htmlFilePath, htmlFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/index.vue') + ' 页面创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/index.vue') + ' 页面已存在'));
        }

        // 创建页面路由
        let routeFilePath = path.join(pageParams.path, 'route.js');
        if (fs.existsSync(routeFilePath) === false) {
            let routeFileData = '';
            if (aliasNames.platform === 'uniapp') {
                routeFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'miniPageRoute.js')))(pageParams);
            }
            if (aliasNames.platform === 'web') {
                routeFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'pageRoute.js')))(pageParams);
            }
            fs.outputFileSync(routeFilePath, routeFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/route.js') + ' 页面路由创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/route.js') + ' 页面路由已存在'));
        }

        // 创建页面接口
        let apiFilePath = path.join(pageParams.path, 'api.js');
        if (fs.existsSync(apiFilePath) === false) {
            let apiFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'api.js')))(pageParams);
            fs.outputFileSync(apiFilePath, apiFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/api.js') + ' 页面接口创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/api.js') + ' 页面接口已存在'));
        }

        // 创建页面说明
        let readmeFilePath = path.join(pageParams.path, 'readme.md');
        if (fs.existsSync(readmeFilePath) === false) {
            let readmeFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'readme.js')))(pageParams);
            fs.outputFileSync(readmeFilePath, readmeFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/readme.md') + ' 页面说明书创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/readme.md') + ' 页面说明书已存在'));
        }

        // 创建页面组件目录
        let componentDirectory = path.join(pageParams.path, 'components');
        if (fs.existsSync(componentDirectory) === false) {
            fs.ensureDirSync(componentDirectory);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/components') + ' 页面组件目录创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/components') + ' 页面组件目录已存在'));
        }

        // 创建页面组件目录说明
        let componentReadmeFilePath = path.join(componentDirectory, 'readme.md');
        if (fs.existsSync(componentReadmeFilePath) === false) {
            let componentReadmeFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'readme.js')))(pageParams);
            fs.outputFileSync(componentReadmeFilePath, componentReadmeFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/readme.md') + ' 页面组件目录说明书创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/readme.md') + ' 页面组件目录说明书已存在'));
        }
    });
    let compParams = {
        names: {}
    };
    // 创建页面组件
    if (cmd.comp) {
        compParams.names = tool.getNames(cmd.comp);
        // 创建页面组件目录
        let componentDirectory = path.join(pageParams.path, 'components', compParams.names.lowerCaseName);
        fs.ensureDirSync(componentDirectory);
        // 创建页面组件
        let htmlFilePath = path.join(componentDirectory, 'index.vue');
        if (fs.existsSync(htmlFilePath) === false) {
            let htmlFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'pageCompHtml.js')))(compParams);
            fs.outputFileSync(htmlFilePath, htmlFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/' + compParams.names.lowerCaseName + '/index.vue') + ' 页面组件创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/' + compParams.names.lowerCaseName + '/index.vue') + ' 页面组件已存在'));
        }

        // 创建页面组件说明
        let readmeFilePath = path.join(componentDirectory, 'readme.md');
        if (fs.existsSync(readmeFilePath) === false) {
            let readmeFileData = _.template(require(path.join(yicodePaths.webpackDir, 'template', 'readme.js')))(compParams);
            fs.outputFileSync(readmeFilePath, readmeFileData);
            spinner.succeed(chalk.green(chalk.blue(pageParams.lowerCaseNameRouteBackslash + '/' + compParams.names.lowerCaseName + '/readme.md') + ' 页面组件说明书创建成功'));
        } else {
            spinner.warn(chalk.green(chalk.yellow(pageParams.lowerCaseNameRouteBackslash + '/' + compParams.names.lowerCaseName + '/readme.md') + ' 页面组件已存在'));
        }
    }
};
