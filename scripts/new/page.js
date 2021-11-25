import fs from 'fs-extra';
import { join, resolve } from 'path';
import { template } from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import { webpackDir } from '../../yicode/paths.js';
import { relativePath, __dirname } from '../../yicode/utils.js';
const spinner = ora();
export async function newPage(options) {
    const dirPath = join(options.newPath, options.fileNames.camelCaseName);
    fs.ensureDirSync(dirPath);

    // 创建页面
    let htmlFilePath = join(dirPath, 'index.vue');
    if (fs.existsSync(htmlFilePath) === false) {
        const { pageTemplate } = await import(relativePath(__dirname(import.meta.url), resolve(webpackDir, 'template', 'pageTemplate.js')));
        let htmlFileData = template(pageTemplate)(options.fileNames);
        fs.outputFileSync(htmlFilePath, htmlFileData);
        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '/index.vue') + ' 页面创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '/index.vue') + ' 页面已存在'));
    }
}
