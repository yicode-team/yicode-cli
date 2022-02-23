import shell from 'shelljs';
import inquirer from 'inquirer';
// 第三方模块
import { merge } from 'lodash-es';
import { getEnvNames } from '../../yicode/utils.js';
import { devMain } from './index.js';

// 提示参数收集
let promptParams = {};

export async function prompt(options) {
    promptParams = merge(promptParams, options);

    // 提示使用的环境变量文件
    let _envFile = await inquirer.prompt([
        {
            type: 'list',
            name: 'executeCommand',
            message: '请选择要执行的命令',
            choices: [
                {
                    name: 'list' + chalk.cyanBright('  显示所有npm源'),
                    value: 'list'
                },
                {
                    name: 'use' + chalk.cyanBright(' 切换npm源'),
                    value: 'use'
                },
                {
                    name: 'current' + chalk.cyanBright('  显示当前npm源'),
                    value: 'current'
                }
            ]
        }
    ]);
    promptParams = merge(promptParams, _envFile);
    // 命令执行路径
    // let commandPath = relativePath(fn_firname(import.meta.url), path.resolve(cliDir, 'scripts', 'npm', promptParams.executeCommand, 'prompt.js'));
    // let { prompt } = await import(commandPath);
    // await prompt();
}
