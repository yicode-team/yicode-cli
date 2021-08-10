// 模块导入
let path = require('path');
let _ = require('lodash');
let fs = require('fs-extra');
let chalk = require('chalk');
let inquirer = require('inquirer');
let requireFresh = require('import-fresh');
let ora = require('ora');

// yicode相关
let yicodePaths = require('../yicode/helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

// 提示参数收集
let promptParams = {};

// 项目配置
let projectSetup = [
    {
        name: yicodeUtils.print(_.padEnd('vue-single', 20, ' ')) + chalk.cyanBright(` 通用vue单页应用开发`),
        value: 'vue-single',
        url: 'https://e.coding.net:chensuiyi/yicode/yicode-template-vue-single#master',
        describe: '通用vue单页应用开发'
    },
    {
        name: yicodeUtils.print(_.padEnd('vue-single@blog', 20, ' ')) + chalk.cyanBright(` yicode官方博客模板`),
        value: 'vue-single@blog',
        url: 'https://e.coding.net:chensuiyi/yicode/yicode-template-vue-single-blog#master',
        describe: 'yicode官方博客模板'
    }
];
let projectObjct = _.keyBy(projectSetup, 'value');

// 检查yicode开发环境
function check_yicodeDevlopmentEnvironment() {
    let yicodeConfigPath = path.resolve(yicodePaths.rootDir, 'yicode.config.js');
    if (fs.pathExistsSync(yicodeConfigPath) === false) {
        inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'isCreateProject',
                    message: `当前目录不是合法的yicode项目，是否创建新项目？（默认：是）`,
                    default: true
                }
            ])
            .then((answer) => {
                promptParams = _.merge(promptParams, answer);
                if (promptParams.isCreateProject === false) {
                    console.log(chalk.whiteBright(`您选择了${yicodeUtils.print('否')}，不创建新项目`));
                    process.exit(1);
                } else {
                    if (yicodeUtils.isEmptyDirectory(yicodePaths.rootDir) === false) {
                        inquirer
                            .prompt([
                                {
                                    type: 'confirm',
                                    name: 'isCoverFile',
                                    message: `当前目录不为空，请确认是否覆盖当前目录下的文件？`,
                                    default: true
                                }
                            ])
                            .then((answer) => {
                                promptParams = _.merge(promptParams, answer);
                                if (promptParams.isCoverFile === false) {
                                    console.log(chalk.whiteBright(`您选择了${yicodeUtils.print('否')}，不覆盖当前目录下的文件`));
                                    fs.removeSync(yicodePaths.tempDir);
                                    fs.ensureDirSync(yicodePaths.tempDir);
                                    chooseProjectType(true);
                                } else {
                                    if (fs.emptyDirSync(yicodePaths.rootDir) === undefined) {
                                        chooseProjectType();
                                    } else {
                                        console.log(chalk.whiteBright(`清空${yicodeUtils.print('当前目录')}，失败`));
                                    }
                                }
                            });
                    } else {
                        console.log('检查yicode.config.js配置1');
                        chooseProjectType();
                    }
                }
            });
    } else {
        let yicodeConfig = requireFresh(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
        require(path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.projectScript, 'index.js'))();
    }
}

// 选择项目类型
function chooseProjectType(isRewrite = false) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'projectType',
                message: '请选择一个项目类型',
                loop: false,
                choices: projectSetup
            }
        ])
        .then((answer) => {
            promptParams = _.merge(promptParams, answer);
            let spinner = ora();
            spinner.start(chalk.green('模板下载中...'));
            promptParams.script = promptParams.projectType.split('@')[0];
            yicodeUtils
                .downloadProject(projectObjct[promptParams.projectType].url, isRewrite)
                .then((res) => {
                    if (isRewrite === true) {
                        fs.copySync(yicodePaths.tempDir, yicodePaths.rootDir, { overwrite: true });
                        fs.removeSync(yicodePaths.tempDir);
                    }
                    spinner.succeed(chalk.greenBright(`${yicodeUtils.print(promptParams.projectType + ' - ' + projectObjct[promptParams.projectType].name)}，下载成功`));
                    console.log(chalk.whiteBright(`请首先使用${yicodeUtils.print('npm install')}命令，安装项目依赖`));
                    console.log(chalk.whiteBright(`然后使用${yicodeUtils.print('yicode dev')}命令，启动本地开发环境`));
                    process.exit(1);
                })
                .catch((err) => {
                    spinner.fail('模板下载失败');
                    console.log('===err');
                    console.log(err);
                });
        });
}

check_yicodeDevlopmentEnvironment();
