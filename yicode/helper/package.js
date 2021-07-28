// 外部模块
let _ = require('lodash');
let path = require('path');
let fs = require('fs-extra');

// 内部模块
let yicodePaths = require('./paths.js');

// yicode项目数据
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'package.json'));

// 项目数据路径
let projectPackagePath = path.resolve(yicodePaths.rootDir, 'package.json');
let projectPackage = {};

// 判断项目信息数据文件是否存在
if (fs.pathExistsSync(projectPackagePath) === true) {
    try {
        projectPackage = require(projectPackagePath);
        if (_.isObject(projectPackage) === false) {
            console.log('package.json文件必须为合法的json格式');
            process.exit(1);
        }
    } catch (err) {
        console.log('package.json文件必须为合法的json格式');
        console.log(err);
        process.exit(1);
    }
}

module.exports = {
    cli: yicodePackage,
    project: projectPackage
};
