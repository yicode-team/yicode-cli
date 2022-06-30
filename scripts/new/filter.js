import fs from 'fs-extra';
import path from 'path';
import * as _ from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
const spinner = ora();
export async function newFilter(options) {
    fs.ensureDirSync(yicodePaths.filterDir);
    // 创建页面
    let htmlFilePath = path.join(yicodePaths.filterDir, options.fileNames.camelCaseName + '.js');
    if (fs.existsSync(htmlFilePath) === false) {
        const { filterTemplate } = await import(yicodeUtils.relativePath(yicodeUtils.fn_dirname(import.meta.url), path.resolve(yicodePaths.webpackDir, 'template', 'filterTemplate.js')));
        let htmlFileData = _.template(filterTemplate)(options.fileNames);
        fs.outputFileSync(htmlFilePath, htmlFileData);
        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '.vue') + ' 过滤器创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '.vue') + ' 过滤器已存在'));
    }
}
