import chalk from 'chalk';
import * as _ from 'lodash-es';
import { yicodePackage } from '../../yicode/package.js';

// 提示参数收集
let promptParams = {};

export async function prompt(options) {
    // 合并参数
    promptParams = _.merge(promptParams, options);
    console.log('yicode-cli版本：' + chalk.blue(`${yicodePackage.version}`));
}
