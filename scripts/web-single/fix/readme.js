// 自带模块
let path = require('path');
// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let shell = require('shelljs');
let ora = require('ora');
let chalk = require('chalk');
let { table } = require('table');
let tool = require('../tool.js');
let fastGlob = require('fast-glob');
// 配置相关
let myConfig = require('../../yicode/yicode.paths.js');
let yicodePackage = require('../../package.json');
let yicodeConfig = require('../../yicode/yicode.config.js');
let rootFileNames = [''];
module.exports = async function build(cmd) {
    let spinner = ora();
    let files = await fastGlob('**/*.vue', { cwd: myConfig.srcDir, dot: true, absolute: true });
    files.forEach((file) => {
        // TODO: 判断是否在根目录下操作
        let dir = path.dirname(file);
        let readmePath = path.join(dir, 'readme.md');
        let relativeReadmePath = path.relative(myConfig.srcDir, readmePath);
        if (fs.existsSync(readmePath) === false) {
            fs.ensureFileSync(readmePath);
            spinner.succeed(chalk.green(relativeReadmePath + ' 说明修复成功'));
        }
    });
};
