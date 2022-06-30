import fs from 'fs-extra';
import path from 'path';
import * as _ from 'lodash-es';
import ora from 'ora';
import chalk from 'chalk';
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
const spinner = ora();
export async function newComponent(options) {
    let dirPath = options.newPath;
    if (options.componentType === 'pageComponent') {
        dirPath = path.join(dirPath, 'components');
    }
    fs.ensureDirSync(dirPath);

    // 创建页面
    let htmlFilePath = path.join(dirPath, options.fileNames.camelCaseName + '.vue');
    if (fs.existsSync(htmlFilePath) === false) {
        let compTemplate = options.componentType === 'globalComponent' ? 'globalComponentTemplate' : 'pageComponentTemplate';
        const { componentTemplate } = await import(yicodeUtils.relativePath(yicodeUtils.fn_firname(import.meta.url), path.resolve(yicodePaths.webpackDir, 'template', `${compTemplate}.js`)));
        let htmlFileData = _.template(componentTemplate)(options.fileNames);
        fs.outputFileSync(htmlFilePath, htmlFileData);
        spinner.succeed(chalk.green(chalk.blue(options.fileNames.camelCaseName + '.vue') + ' 组件创建成功'));
    } else {
        spinner.warn(chalk.green(chalk.yellow(options.fileNames.camelCaseName + '.vue') + ' 组件已存在'));
    }
}
