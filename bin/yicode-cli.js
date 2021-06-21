#!/usr/bin/env node
// 自带模块
let path = require('path');

// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let commander = require('commander');
let { table } = require('table');
let execa = require('execa');

// 配置相关
let yicodePaths = require('../yicode/yicode.paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'package.json'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'yicode.config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'scripts', 'yicode.utils.js'));

// TODO: 还需要严格验证yicode.config.js文件的有效性
let program = new commander.Command('yicode');

program
    .storeOptionsAsProperties(false) // ；屏蔽参数作为cmd的属性
    .enablePositionalOptions(true) // 严格开启顺序
    .allowExcessArguments(false) // 严格控制参数顺序
    .passThroughOptions(true) // 严格控制参数前后顺序
    .name('yicode')
    .usage('<命令> [参数] 操作对象');

program
    .command('dev', { hidden: true })
    .addOption(new commander.Option('--env <配置文件名称>', '指定环境配置文件').choices(yicodeUtils.getEnvNames()))
    .option('--write', '写入硬盘', false)
    .description('启动开发环境')
    .action((options, cmd) => {
        let dirDev = path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.type, 'dev');
        require(path.resolve(dirDev, 'index.js'))(options, cmd);
    });

program
    .command('build', { hidden: true })
    .addOption(new commander.Option('--env <配置文件名称>', '指定环境配置文件').choices(yicodeUtils.getEnvNames()))
    .option('--analyzer', '启动分析模式', false)
    .description('打包编译项目')
    .action((options, cmd) => {
        let dirBuild = path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.type, 'build');
        require(path.resolve(dirBuild, 'index.js'))(options, cmd);
    });

/**
 * 创建命令
 */
program
    .command('new', { hidden: true })
    .option('-p,--page <name>', '创建页面')
    .option('-c,--comp <name>', '创建全局组件')
    .option('-f,--filter <name>', '创建全局过滤器')
    .option('-d,--directive <name>', '创建全局指令')
    .option('-i,--api <name>', '创建通用接口')
    .description('创建元素')
    .action((options, cmd) => {
        let dirNew = path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.type, 'new');
        if (options.api) {
            require(path.resolve(dirNew, 'api.js'))(options, cmd);
            return;
        }
        if (options.filter) {
            require(path.resolve(dirNew, 'filter.js'))(options, cmd);
            return;
        }
        if (options.directive) {
            require(path.resolve(dirNew, 'directive.js'))(options, cmd);
            return;
        }
        if (options.comp && !cmd.page) {
            require(path.resolve(dirNew, 'comp.js'))(options, cmd);
            return;
        }
        if (options.page) {
            require(path.resolve(dirNew, 'page.js'))(options, cmd);
            return;
        }
    });

// TODO: 重命名元素
// program
//     .command('rename')
//     .option('-p,--page <原页面名称>', '原页面')
//     .option('-c,--comp <原组件名称>', '原组件')
//     .option('--nc,--new-comp <新组件名称>', '新组件')
//     .description('修改元素')
//     .action((cmd) => {
//         // 如果指定了页面参数
//         if (cmd.page) {
//             // 如果重命名子页面
//             if (cmd.subPage) {
//                 require('./rename/subPage.js')(cmd);
//                 return;
//             }
//             // 如果重命名子视图
//             if (cmd.subView) {
//                 require('./rename/subView.js')(cmd);
//                 return;
//             }
//             // 如果重命名页面
//             require('./rename/page.js')(cmd);
//             return;
//         }
//         if (cmd.comp && cmd.newComp) {
//             require('./rename/comp.js')(cmd);
//             return;
//         }
//     });

// program
//     .command('show')
//     .option('-p,--pages', '查看所有页面')
//     .option('-c,--comps', '查看所有全局组件')
//     .description('查看项目相关信息')
//     .action((cmd) => {
//         if (cmd.pages) {
//             require('./show/pages.js')(cmd);
//         }
//         if (cmd.comps) {
//             require('./show/comps.js')(cmd);
//         }
//     });

/**
 * 查看所有命令
 */
// program
//     .command('all', { hidden: true })
//     .description('查看所有命令')
//     .action((options, cmd) => {
//         require('./all/index.js')(options, cmd);
//     });

program
    .command('tpl', { hidden: true })
    .addOption(new commander.Option('-t,--type <模板名称>', '初始化项目模板').choices(['web', 'phalapi', 'uniapp']))
    .description('初始化项目模板')
    .action((options, cmd) => {
        let dirTpl = path.resolve(yicodePaths.cliDir, 'scripts', yicodeConfig.type, 'tpl');
        if (options.type === 'admin') {
            require(path.resolve(dirTpl, 'admin.js'))(options, cmd);
            return;
        }
        if (options.type === 'phalapi') {
            require(path.resolve(dirTpl, 'phalapi.js'))(options, cmd);
            return;
        }
        if (options.type === 'web') {
            require(path.resolve(dirTpl, 'web.js'))(options, cmd);
            return;
        }
        if (options.type === 'uniapp') {
            require(path.resolve(dirTpl, 'uniapp.js'))(options, cmd);
            return;
        }
        if (options.type === 'blog') {
            require(path.resolve(dirTpl, 'blog.js'))(options, cmd);
            return;
        }
    });

// program
//     //
//     .command('doctor')
//     .option('-t,--type', '检测元素')
//     .description('检测元素')
//     .action((cmd) => {
//         require('./doctor/all.js')(cmd);
//     });

// program
//     //
//     .command('lint')
//     .option('-t,--type <规范类型>', '规范类型')
//     .description('检测规范')
//     .action((cmd) => {
//         // 检测脚本规范
//         if (cmd.type === 'script') {
//             require('./lint/script.js')(cmd);
//             return;
//         }

//         // 检测样式规范
//         if (cmd.type === 'style') {
//             require('./lint/style.js')(cmd);
//             return;
//         }

//         // 检测所有规范
//         require('./lint/all.js')(cmd);
//         return;
//     });

// program
//     //
//     .command('format <file>')
//     .description('格式化文件')
//     .action((file) => {
//         // 检测所有规范
//         require('./format/all.js')(file);
//         return;
//     });

// program
//     //
//     .command('fix')
//     .option('-t,--type <元素类型名>', '修复元素')
//     .description('修复元素')
//     .action((cmd) => {
//         if (cmd.type === 'all') {
//             require('./fix/all.js')(cmd);
//         }
//         if (cmd.type === 'readme') {
//             require('./fix/readme.js')(cmd);
//         }
//     });

program
    //
    .command('test', { hidden: true })
    .option('-a,--a [a]', 'a')
    .option('-b,--b [b]', 'b')
    .description('测试')
    .action(async (options, cmd) => {
        // let dd = await execa.commandSync('ls -al --color=always');
        // process.stdout.write(dd.stdout);
    });

program.version(yicodePackage.version, '-v, --version', '显示yicode版本');
program.addHelpText('afterAll', '');
program.parse(process.argv);
