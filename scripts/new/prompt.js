import * as _ from 'lodash-es';
import path from 'path';
import shell from 'shelljs';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import * as yicodeUtils from '../../yicode/utils.js';
import { newPage } from './page.js';
import { newComponent } from './component.js';
import { newDirective } from './directive.js';
import { newFilter } from './filter.js';

import { rootDir, pageDir, componentDir } from '../../yicode/paths.js';

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
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
    const _newType = await inquirer.prompt([
        {
            type: 'list',
            name: 'newType',
            choices: [
                {
                    name: '页面',
                    value: 'page'
                },
                {
                    name: '组件',
                    value: 'component'
                },
                {
                    name: '指令',
                    value: 'directive'
                },
                {
                    name: '过滤器',
                    value: 'filter'
                }
            ],
            message: '请选择新建类型'
        }
    ]);
    promptParams = _.merge(promptParams, _newType);

    if (promptParams.newType === 'page') {
        const _newPath = await inquirer.prompt({
            type: 'file-tree-selection',
            name: 'newPath',
            message: '请选择目录',
            onlyShowDir: true,
            root: pageDir
        });
        promptParams = _.merge(promptParams, _newPath);

        const _newName = await inquirer.prompt({
            type: 'input',
            name: 'newName',
            message: '请输入页面名称'
        });

        promptParams = _.merge(promptParams, _newName, { fileNames: yicodeUtils.getFileNames(_newName.newName) });
        await newPage(promptParams);
    }

    if (promptParams.newType === 'component') {
        const _componentType = await inquirer.prompt({
            type: 'list',
            name: 'componentType',
            choices: [
                {
                    name: '全局组件',
                    value: 'globalComponent'
                },
                {
                    name: '页面组件',
                    value: 'pageComponent'
                }
            ],
            message: '创建全局组件还是页面组件？'
        });
        promptParams = _.merge(promptParams, _componentType);
        let promptObject = {
            type: 'file-tree-selection',
            name: 'newPath',
            message: '请选择组件目录',
            onlyShowDir: true,
            root: promptParams.componentType === 'pageComponent' ? pageDir : componentDir
        };

        // 排除页面目录本身
        if (promptParams.componentType === 'pageComponent') {
            promptObject.validate = (path) => {
                return path !== pageDir;
            };
        }
        const _newPath = await inquirer.prompt(promptObject);
        promptParams = _.merge(promptParams, _newPath);

        const _newName = await inquirer.prompt({
            type: 'input',
            name: 'newName',
            message: '请输入组件名称'
        });
        promptParams = _.merge(promptParams, _newName, { fileNames: yicodeUtils.getFileNames(_newName.newName) });
        await newComponent(promptParams);
    }

    if (promptParams.newType === 'directive') {
        const _newName = await inquirer.prompt({
            type: 'input',
            name: 'newName',
            message: '请输入指令名称'
        });
        promptParams = _.merge(promptParams, _newName, { fileNames: yicodeUtils.getFileNames(_newName.newName) });
        await newDirective(promptParams);
    }

    if (promptParams.newType === 'filter') {
        const _newName = await inquirer.prompt({
            type: 'input',
            name: 'newName',
            message: '请输入过滤器名称'
        });
        promptParams = _.merge(promptParams, _newName, { fileNames: yicodeUtils.getFileNames(_newName.newName) });
        await newFilter(promptParams);
    }
}
