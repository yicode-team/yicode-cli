import fs from 'fs-extra';
import path from 'path';
import * as _ from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
const spinner = ora();
export async function newDirective(options) {
    fs.ensureDirSync(yicodePaths.directiveDir);
    // 创建页面
    let htmlFilePath = path.join(yicodePaths.directiveDir, options.fileNames.camelCaseName + '.js');
    if (fs.existsSync(htmlFilePath) === false) {
        let directivePath = yicodeUtils.getFileProtocolPath(path.resolve(yicodePaths.webpackDir, 'template', 'directiveTemplate.js'));

        const { directiveTemplate = '' } = await yicodeUtils.importModule(directivePath, {});

        let htmlFileData = _.template(directiveTemplate)(options.fileNames);

        fs.outputFileSync(htmlFilePath, htmlFileData);

        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '.vue') + ' 指令创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '.vue') + ' 指令已存在'));
    }
}
