import shell from 'shelljs';
import inquirer from 'inquirer';
// 第三方模块
import * as _ from 'lodash-es';
import * as yicodeUtils from '../../yicode/utils.js';
import { main } from './index.js';

// 提示参数收集
let promptParams = {};

export async function prompt(options) {
    promptParams = _.merge(promptParams, options);

    // 提示使用的环境变量文件
    let _envFile = await inquirer.prompt([
        {
            type: 'list',
            name: 'envFile',
            choices: yicodeUtils.getEnvNames(promptParams),
            message: '请选择使用的环境变量文件'
        }
    ]);
    promptParams = _.merge(promptParams, _envFile);

    /**
     * 选择是否启动分析模式
     * 如果不是vite项目，才启动分析模式
     */
    // if (promptParams.isViteProject === false) {
    //     const _isAnalyzer = await inquirer.prompt([
    //         {
    //             type: 'confirm',
    //             name: 'isAnalyzer',
    //             message: '是否启动分析模式？（默认：否）',
    //             default: false
    //         }
    //     ]);
    //     promptParams = _.merge(promptParams, _isAnalyzer);
    // }

    main(promptParams);
}
