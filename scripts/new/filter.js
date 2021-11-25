import fs from 'fs-extra';
import { join, resolve } from 'path';
import { template } from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import { webpackDir, filterDir } from '../../yicode/paths.js';
import { relativePath, __dirname } from '../../yicode/utils.js';
const spinner = ora();
export async function newFilter(options) {
    fs.ensureDirSync(filterDir);
    // 创建页面
    let htmlFilePath = join(filterDir, options.fileNames.camelCaseName + '.js');
    if (fs.existsSync(htmlFilePath) === false) {
        const { filterTemplate } = await import(relativePath(__dirname(import.meta.url), resolve(webpackDir, 'template', 'filterTemplate.js')));
        let htmlFileData = template(filterTemplate)(options.fileNames);
        fs.outputFileSync(htmlFilePath, htmlFileData);
        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '.vue') + ' 过滤器创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '.vue') + ' 过滤器已存在'));
    }
}
