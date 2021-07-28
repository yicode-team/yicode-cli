// 模块导入
let path = require('path');
let _ = require('lodash');
let fs = require('fs-extra');
let chalk = require('chalk');
let inquirer = require('inquirer');
let requireFresh = require('import-fresh');

// yicode相关
let yicodePaths = require('../yicode/helper/paths.js');
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

// 提示参数收集
let promptParams = {};
// 项目路径
let projectGitPath = {
    'web-single': {
        url: 'https://e.coding.net:chensuiyi/yicode/yicode-template-web#master',
        type: 'web-single',
        name: 'webpack单页应用开发'
    }
};

// 检查yicode开发环境
function check_yicodeDevlopmentEnvironment() {
    let yicodeConfigPath = path.resolve(yicodePaths.rootDir, 'yicode.config.js');
    if (fs.pathExistsSync(yicodeConfigPath) === false) {
        inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'isCreateProject',
                    message: `当前目录不是合法的yicode项目，是否创建新项目？`,
                    default: true
                }
            ])
            .then((answer) => {
                promptParams = _.merge(promptParams, answer);
                if (promptParams.isCreateProject === false) {
                    console.log(chalk.red(`您选择了${yicodeUtils.print('否')}，不创建新项目`));
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
                                    console.log(chalk.red(`您选择了${yicodeUtils.print('否')}，不覆盖当前目录下的文件`));
                                    process.exit(1);
                                } else {
                                    if (fs.emptyDirSync(yicodePaths.rootDir) === undefined) {
                                        chooseProjectType();
                                    } else {
                                        console.log(chalk.red(`清空${yicodeUtils.print('当前目录')}，失败`));
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
        let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
        require(path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.projectType, 'index.js'))();
    }
}

// 选择项目类型
function chooseProjectType() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'projectType',
                message: '请选择一个项目类型',
                loop: false,
                choices: [
                    {
                        name: yicodeUtils.print(_.padEnd('web-single', 14, ' ')) + chalk.cyanBright('  webpack单页应用开发'),
                        value: 'web-single'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('web-multiple', 14, ' ')) + chalk.cyanBright('  webpack多页应用开发'),
                        value: 'web-multiple'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('web-static', 14, ' ')) + chalk.cyanBright('  gulp多页静态项目开发'),
                        value: 'web-static'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('uniapp-mini', 14, ' ')) + chalk.cyanBright('  基于uniapp开发小程序'),
                        value: 'uniapp-mini'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('weixin-mini', 14, ' ')) + chalk.cyanBright('  微信原生小程序项目'),
                        value: 'weixinMini'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('php-api', 14, ' ')) + chalk.cyanBright('  基于php开发后端接口'),
                        value: 'phpApi'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('node-api', 14, ' ')) + chalk.cyanBright('  基于nodejs开发后端接口'),
                        value: 'nodeApi'
                    },
                    {
                        name: yicodeUtils.print(_.padEnd('java-api', 14, ' ')) + chalk.cyanBright('  基于java开发后端接口'),
                        value: 'javaApi'
                    }
                ]
            }
        ])
        .then((answer) => {
            promptParams = _.merge(promptParams, answer);
            yicodeUtils
                .downloadProject(projectGitPath[promptParams.projectType].url)
                .then((res) => {
                    console.log(chalk.greenBright(`${yicodeUtils.print(projectGitPath[promptParams.projectType].type + ' - ' + projectGitPath[promptParams.projectType].name)}，下载成功`));
                    console.log(chalk.whiteBright(`请首先使用${yicodeUtils.print('npm install')}命令，安装项目依赖`));
                    console.log(chalk.whiteBright(`然后使用${yicodeUtils.print('yicode dev')}命令，启动本地开发环境`));
                    process.exit(1);
                })
                .catch((err) => {
                    console.log('===err');
                    console.log(err);
                });
        });
}

check_yicodeDevlopmentEnvironment();
// if (yicodeHelper2.config.projectType) {
//     require(path.resolve(yicodeHelper2.paths.cliDir, 'scripts', yicodeHelper2.config.projectType, 'index.js'));
//     console.log(yicodeHelper2);
// } else {
//     // 执行项目创建
//     require('./prompt.js').chooseProjectType();
// }
