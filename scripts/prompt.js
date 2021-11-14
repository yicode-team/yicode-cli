// 模块导入
import path from 'path';
import _ from 'lodash';
import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import requireFresh from 'import-fresh';
import ora from 'ora';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';

// yicode相关
import { rootDir, tempDir, cliDir } from '../yicode/paths.js';
// import yicodePackage from path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js');
import { isEmptyDirectory, downloadProject, relativePath, __dirname, __filename } from '../yicode/utils.js';

// TODO: 后期支持版本下载
// 项目模板配置
const projectTemplateConfig = [
    {
        name: 'vue-base 基础模板',
        value: 'vue-base',
        describe: '通用Vue单页应用开发',
        filename: 'yicode-template-vue-base.zip',
        url: 'https://static.chensuiyi.com/download/yicode-template-vue-base.zip'
    }
];
const projectTemplateConfigByValue = _.keyBy(projectTemplateConfig, 'value');

// 提示参数收集
let promptParams = {
    // 是否创建项目
    isCreateProject: true,
    // 是否覆盖当前目录
    isRewriteDirectory: true,
    // 项目模板类型
    projectTemplateType: 'vue-base',
    // 执行命令
    executeCommand: 'dev'
};
/**
 * 是否创建新项目
 */
async function isCreateProject() {
    /**
     * 解析yicode脚手架专用文件
     * 如果该文件不存在，则认定为不是yicode项目
     * 不是yicode项目，则询问是否需要下载模板
     */

    let yicodeConfigPath = path.resolve(rootDir, 'yicode.config.js');
    if (fs.pathExistsSync(yicodeConfigPath) === false) {
        const _isCreateProject = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isCreateProject',
                message: `当前目录不是合法的yicode项目，是否创建新项目？（默认：是）`,
                default: promptParams.isCreateProject
            }
        ]);
        _.merge(promptParams, _isCreateProject);

        // 如果选择不创建新项目
        if (promptParams.isCreateProject === false) {
            process.exit(1);
        } else {
            await isRewriteDirectory();
        }
    } else {
        await executeCommand();
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
        _.merge(promptParams, _isRewriteDirectory);
        if (promptParams.isRewriteDirectory === false) {
            process.exit(1);
        } else {
            await projectTemplateType();
        }
    } else {
        await projectTemplateType();
    }
}

/**
 * 选择创建的项目模板类型
 */
async function projectTemplateType() {
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
    _.merge(promptParams, _projectTemplateType);

    // 清空当前目录
    fs.emptyDirSync(rootDir);

    // 下载项目
    await downloadProject(projectTemplateConfigByValue[promptParams.projectTemplateType]);

    // 创建zip压缩实例
    const zip = new AdmZip(path.resolve(tempDir, projectTemplateConfigByValue[promptParams.projectTemplateType].filename));

    // 解压zip到当前目录
    await zip.extractAllTo(rootDir, true);

    // 移除临时目录
    fs.removeSync(tempDir);

    // 执行命令
    await executeCommand();
}

/**
 * 选择要执行的命令
 */
async function executeCommand() {
    let _executeCommand = await inquirer.prompt([
        {
            type: 'list',
            name: 'executeCommand',
            message: '请选择一个命令',
            default: promptParams.executeCommand,
            choices: [
                {
                    name: 'dev' + chalk.cyanBright('  在本机环境进行开发调试'),
                    value: 'dev'
                },
                {
                    name: 'build' + chalk.cyanBright(' 进行线上（测试/正式）环境编译打包'),
                    value: 'build'
                }
                // {
                //     name: 'new' + chalk.cyanBright('  创建新的（页面/组件/路由/指令/过滤器）文件'),
                //     value: 'new'
                // }
                // {
                //     name: 'rename' + chalk.cyanBright('  重命名（页面/组件/路由/指令/过滤器）文件'),
                //     value: 'rename'
                // }
            ]
        }
    ]);
    _.merge(promptParams, _executeCommand);
    // 命令执行路径
    let commandPath = relativePath(__dirname(import.meta.url), path.resolve(cliDir, 'scripts', promptParams.executeCommand, 'index.js'));
    let { main } = await import(commandPath);
    main();
}

export default isCreateProject;
