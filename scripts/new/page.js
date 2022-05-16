import fs from 'fs-extra';
import { join, resolve, relative } from 'path';
import { template } from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import { webpackDir, pageDir } from '../../yicode/paths.js';
import { relativePath, fn_firname } from '../../yicode/utils.js';
const spinner = ora();
export async function newPage(options) {
    let htmlFilePath = '';
    options.newPath = join(options.newPath, options.fileNames.camelCaseName);
    fs.ensureDirSync(options.newPath);
    htmlFilePath = resolve(options.newPath, 'index.vue');
    let routePath = resolve(options.newPath, 'route.js');
    let pagePath = relative(pageDir, htmlFilePath).replace(/\\+/g, '/');
    options.filePaths = {};
    options.filePaths.pagePath = pagePath;
    options.filePaths.pageRoute = pagePath.replace(/(\/index)?\.vue/, '').replace(/\\+/g, '/');

    if (fs.existsSync(htmlFilePath) === false) {
        // 创建页面
        const { pageTemplate } = await import(relativePath(fn_firname(import.meta.url), resolve(webpackDir, 'template', 'pageTemplate.js')));

        let htmlFileData = template(pageTemplate)(options);
        fs.outputFileSync(htmlFilePath, htmlFileData);

        // 创建页面路由
        const { pageRoute } = await import(relativePath(fn_firname(import.meta.url), resolve(webpackDir, 'template', 'pageRoute.js')));

        let routeFileData = template(pageRoute)(options);
        fs.outputFileSync(routePath, routeFileData);

        spinner.succeed(chalk.green(chalk.blue(pagePath) + ' 页面创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(pagePath) + ' 页面已存在'));
    }
}
