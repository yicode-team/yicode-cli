import fs from 'fs-extra';
import path from 'path';
import * as _ from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
const spinner = ora();
export async function newPage(options) {
    let htmlFilePath = '';
    options.newPath = path.join(options.newPath, options.fileNames.camelCaseName);
    fs.ensureDirSync(options.newPath);
    htmlFilePath = path.resolve(options.newPath, 'index.vue');
    let routePath = path.resolve(options.newPath, 'route.js');
    let pagePath = path.relative(yicodePaths.pageDir, htmlFilePath).replace(/\\+/g, '/');
    options.filePaths = {};
    options.filePaths.pagePath = pagePath;
    options.filePaths.pageRoute = pagePath.replace(/(\/index)?\.vue/, '').replace(/\\+/g, '/');

    if (fs.existsSync(htmlFilePath) === false) {
        // 创建页面
        let pagePath = yicodeUtils.getFileProtocolPath(path.resolve(yicodePaths.webpackDir, 'template', 'pageTemplate.js'));
        const { pageTemplate = '' } = await yicodeUtils.importModule(pagePath, {});

        let htmlFileData = _.template(pageTemplate)(options);
        fs.outputFileSync(htmlFilePath, htmlFileData);

        // 创建页面路由
        let pageRoutePath = yicodeUtils.getFileProtocolPath(path.resolve(yicodePaths.webpackDir, 'template', 'pageRoute.js'));
        const { pageRoute = '' } = await yicodeUtils.importModule(pageRoutePath, {});

        let routeFileData = _.template(pageRoute)(options);
        fs.outputFileSync(routePath, routeFileData);

        spinner.succeed(chalk.green(chalk.blue(pagePath) + ' 页面创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(pagePath) + ' 页面已存在'));
    }
}
