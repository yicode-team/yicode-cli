// 模块导入
import path from 'path';
import { keyBy, merge } from 'lodash-es';
import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';

// yicode相关
import { rootDir, tempDir, cliDir } from '../../yicode/paths.js';
// import yicodePackage from path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js');
import { isEmptyDirectory, downloadProject, relativePath, fn_firname, fn_filename } from '../../yicode/utils.js';

// 项目模板配置
const projectTemplateConfig = [
    {
        name: '基础模板(vue2-base-webpack)',
        value: 'vue2-base-webpack',
        describe: '通用Vue2基础项目模板',
        filename: 'yicode-template-vue2-base-webpack.zip',
        url: 'https://static.chensuiyi.com/download/yicode-template-vue2-base-webpack.zip'
    },
    {
        name: '基础模板(vue3-base-vite)',
        value: 'vue3-base-vite',
        describe: '通用Vue3基础项目模板',
        filename: 'yicode-template-vue3-base-vite.zip',
        url: 'https://static.chensuiyi.com/download/yicode-template-vue3-base-vite.zip'
    },
    {
        name: '后台模板(vue2-admin-webpack)',
        value: 'vue2-admin-webpack',
        describe: '通用Vue2后台项目模板',
        filename: 'yicode-template-vue2-admin-webpack.zip',
        url: 'https://static.chensuiyi.com/download/yicode-template-vue2-admin-webpack.zip'
    }
];
const projectTemplateConfigByValue = keyBy(projectTemplateConfig, 'value');

// 提示参数收集
let promptParams = {
    // 是否创建项目
    isCreateProject: true,
    // 是否覆盖当前目录
    isRewriteDirectory: false,
    // 项目模板类型
    projectTemplateType: 'vue2-base-webpack',
    // 执行命令
    executeCommand: 'dev'
};

/**
 * 是否创建新项目
 */
async function prompt() {
    /**
     * 解析yicode脚手架专用文件
     * 如果该文件不存在，则认定为不是yicode项目
     * 不是yicode项目，则询问是否需要下载模板
     */
    const _isCreateProject = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'isCreateProject',
            message: `当前目录不是合法的yicode项目，是否创建新项目？（默认：是）`,
            default: promptParams.isCreateProject
        }
    ]);
    merge(promptParams, _isCreateProject);

    // 如果选择不创建新项目
    if (promptParams.isCreateProject === false) {
        process.exit(1);
    } else {
        await isRewriteDirectory();
    }
}

/**
 * 是否覆盖当前目录
 */
async function isRewriteDirectory() {
    if (isEmptyDirectory(rootDir) === false) {
        let _isRewriteDirectory = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isRewriteDirectory',
                message: `当前目录不为空，请确认是否覆盖当前目录下的文件？`,
                default: promptParams.isRewriteDirectory
            }
        ]);
        merge(promptParams, _isRewriteDirectory);
    }
    await projectTemplateType();
}

/**
 * 选择创建的项目模板类型
 */
async function projectTemplateType() {
    try {
        const _projectTemplateType = await inquirer.prompt([
            {
                type: 'list',
                name: 'projectTemplateType',
                message: '请选择一个项目类型',
                loop: false,
                default: promptParams.projectTemplateType,
                choices: projectTemplateConfig
            }
        ]);

        merge(promptParams, _projectTemplateType);

        let projectItem = projectTemplateConfigByValue[promptParams.projectTemplateType];

        // 下载项目
        await downloadProject(projectItem);

        // 创建zip压缩实例
        const zip = new AdmZip(path.resolve(tempDir, projectItem.filename));

        /**
         * 如果覆盖当前目录的话，则清空根目录
         */
        if (promptParams.isRewriteDirectory === true) {
            fs.emptyDirSync(rootDir);
            await zip.extractAllTo(rootDir, true);
        } else {
            await zip.extractAllTo(tempDir, true);
            await fs.removeSync(path.join(tempDir, projectItem.filename));
            await fs.copySync(tempDir, rootDir);
        }

        // 移除临时目录
        fs.removeSync(tempDir);
    } catch (err) {
        chalk.bgRed('下载失败');
    }
}

export { prompt };
