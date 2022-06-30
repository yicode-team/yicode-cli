// 模块导入
import path from 'path';
import * as _ from 'lodash-es';
import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';

// yicode相关
import * as yicodePaths from '../yicode/paths.js';
import * as yicodeUtils from '../yicode/utils.js';
import yicodeConfig from '../yicode/config.js';

// 提示参数收集
let promptParams = {
    // 执行命令
    executeCommand: 'dev'
};

/**
 * 选择要执行的命令
 */
async function executeCommand() {
    let yicodeConfigPath = path.resolve(yicodePaths.rootDir, 'yicode.config.js');
    let choices = [
        {
            name: 'version' + chalk.cyanBright('  查看版本信息'),
            value: 'version'
        }
    ];

    // 如果是合法的yicode项目，则具有更多命令
    if (fs.pathExistsSync(yicodeConfigPath) === true) {
        choices.unshift({
            name: 'new' + chalk.cyanBright('  创建（页面/组件/路由/指令/过滤器）文件'),
            value: 'new'
        });
        choices.unshift({
            name: 'build' + chalk.cyanBright(' 进行线上（测试/正式）环境编译打包'),
            value: 'build'
        });
        choices.unshift({
            name: 'dev' + chalk.cyanBright('  在本机环境进行开发调试'),
            value: 'dev'
        });
    } else {
        choices.unshift({
            name: 'create' + chalk.cyanBright('  创建新项目'),
            value: 'create'
        });
    }

    let _executeCommand = await inquirer.prompt([
        {
            type: 'list',
            name: 'executeCommand',
            message: '请选择一个命令',
            default: promptParams.executeCommand,
            choices: choices
        }
    ]);
    _.merge(promptParams, _executeCommand);

    // 如果项目类型（productType）字符串中带有vite字样，则表示使用vite打包。
    if (promptParams.executeCommand === 'dev' && yicodeConfig.projectType.indexOf('-vite') !== -1) {
        // vite 工具命令执行路径
        let commandPath = yicodeUtils.relativePath(yicodeUtils.fn_dirname(import.meta.url), path.resolve(yicodePaths.cliDir, 'scripts', 'devVite', 'prompt.js'));
        let { prompt } = await import(commandPath);
        await prompt();

        return;
    }
    // 命令执行路径
    let commandPath = yicodeUtils.relativePath(yicodeUtils.fn_dirname(import.meta.url), path.resolve(yicodePaths.cliDir, 'scripts', promptParams.executeCommand, 'prompt.js'));
    let { prompt } = await import(commandPath);
    await prompt();
}

export default executeCommand;
