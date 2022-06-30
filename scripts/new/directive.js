import fs from 'fs-extra';
import { join, resolve } from 'path';
import * as _ from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import { webpackDir, directiveDir } from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
const spinner = ora();
export async function newDirective(options) {
    fs.ensureDirSync(directiveDir);
    // 创建页面
    let htmlFilePath = join(directiveDir, options.fileNames.camelCaseName + '.js');
    if (fs.existsSync(htmlFilePath) === false) {
        const { directiveTemplate } = await import(yicodeUtils.relativePath(yicodeUtils.fn_firname(import.meta.url), resolve(webpackDir, 'template', 'directiveTemplate.js')));
        let htmlFileData = _.template(directiveTemplate)(options.fileNames);
        fs.outputFileSync(htmlFilePath, htmlFileData);
        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '.vue') + ' 指令创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '.vue') + ' 指令已存在'));
    }
}
