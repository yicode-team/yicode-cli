import * as _ from 'lodash-es';
import shell from 'shelljs';
import inquirer from 'inquirer';
import * as yicodeUtils from '../../yicode/utils.js';
import { main } from './index.js';

// 使用产品模式
shell.env['NODE_MODE'] = 'production';

// 提示参数收集
let promptParams = {};

export async function prompt(options) {
    // 合并参数
    promptParams = _.merge(promptParams, options);

    /**
     * ==========================================
     * 选择环境变量文件
     * ==========================================
     */
    const _envFile = await inquirer.prompt([
        {
            type: 'list',
            name: 'envFile',
            choices: yicodeUtils.getEnvNames(),
            message: '选择使用的环境变量文件'
        }
    ]);
    promptParams = _.merge(promptParams, _envFile);

    /**
     * ==========================================
     * 选择是否启动分析模式
     * ==========================================
     */
    const _isAnalyzer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'isAnalyzer',
            message: '是否启动分析模式？（默认：否）',
            default: false
        }
    ]);
    promptParams = _.merge(promptParams, _isAnalyzer);

    // 开发脚本
    main(promptParams);
}
