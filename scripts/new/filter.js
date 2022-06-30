import fs from 'fs-extra';
import { join, resolve } from 'path';
import * as _ from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import { webpackDir, filterDir } from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
const spinner = ora();
export async function newFilter(options) {
    fs.ensureDirSync(filterDir);
    // 创建页面
    let htmlFilePath = join(filterDir, options.fileNames.camelCaseName + '.js');
    if (fs.existsSync(htmlFilePath) === false) {
        const { filterTemplate } = await import(yicodeUtils.relativePath(yicodeUtils.fn_firname(import.meta.url), resolve(webpackDir, 'template', 'filterTemplate.js')));
        let htmlFileData = _.template(filterTemplate)(options.fileNames);
        fs.outputFileSync(htmlFilePath, htmlFileData);
        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '.vue') + ' 过滤器创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '.vue') + ' 过滤器已存在'));
    }
}
