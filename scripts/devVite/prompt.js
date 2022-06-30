import shell from 'shelljs';
import inquirer from 'inquirer';
// 第三方模块
import { merge } from 'lodash-es';
import * as yicodeUtils from '../../yicode/utils.js';
import { devMain } from './index.js';

// 提示参数收集
let promptParams = {};

// 使用产品模式
shell.env['NODE_MODE'] = 'development';

export async function prompt(options) {
    promptParams = merge(promptParams, options);

    // 提示使用的环境变量文件
    // let _envFile = await inquirer.prompt([
    //     {
    //         type: 'list',
    //         name: 'envFile',
    //         choices: yicodeUtils.getViteEnvNames(),
    //         message: '请选择使用的环境变量文件'
    //     }
    // ]);
    // promptParams = merge(promptParams, _envFile);
    // 默认使用开发者模式
    shell.env['NODE_MODE'] = 'development';
    // 选择的环境变量文件
    // shell.env['NODE_ENV_FILE'] = promptParams.envFile;

    /**
     * ==========================================
     * 选择是否启动分析模式
     * ==========================================
     */
    // const _isAnalyzer = await inquirer.prompt([
    //     {
    //         type: 'confirm',
    //         name: 'isAnalyzer',
    //         message: '是否启动分析模式？（默认：否）',
    //         default: false
    //     }
    // ]);
    // promptParams = merge(promptParams, _isAnalyzer);
    // 是否启动分析模式
    // shell.env['NODE_ANALYZER'] = promptParams.isAnalyzer;

    devMain();
}
