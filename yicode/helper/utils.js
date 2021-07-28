// 外部模块
let path = require('path');
let _ = require('lodash');
let download = require('download-git-repo');
let fs = require('fs-extra');
let chalk = require('chalk');

// 配置相关
let yicodePaths = require('./paths.js');

// 下载项目
exports.downloadProject = async function downloadProject(gitUrl, tempDir) {
    return new Promise((resolve, reject) => {
        download(gitUrl, tempDir || yicodePaths.rootDir, { clone: true }, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.getNames = function getNames(name) {
    // 页面名称转化 HelL_o-wOrld
    let lowerCaseName = _.toLower(name); // hell_o-world
    let kebabCaseName = _.kebabCase(lowerCaseName); // hell-o-world
    let camelCaseName = _.camelCase(kebabCaseName); // hellOWorld
    let startCaseName = _.replace(_.startCase(camelCaseName), /\s+/g, ''); // HellOWorld

    return {
        lowerCaseName,
        kebabCaseName,
        startCaseName,
        camelCaseName
    };
};

exports.getAllNames = function getAllNames(rootNames = {}, subNames = {}, tailNames = {}, compNames = {}, options = {}) {
    let hash = {
        options: options
    };
    if (rootNames) {
        hash.page = {
            lowerCaseName: rootNames.lowerCaseName,
            kebabCaseName: rootNames.kebabCaseName,
            startCaseName: rootNames.startCaseName,
            camelCaseName: rootNames.camelCaseName
        };
    }
    if (subNames) {
        hash.sub = {
            lowerCaseName: subNames.lowerCaseName,
            kebabCaseName: subNames.kebabCaseName,
            startCaseName: subNames.startCaseName,
            camelCaseName: subNames.camelCaseName
        };
    }
    if (tailNames) {
        hash.tail = {
            lowerCaseName: tailNames.lowerCaseName,
            kebabCaseName: tailNames.kebabCaseName,
            startCaseName: tailNames.startCaseName,
            camelCaseName: tailNames.camelCaseName
        };
    }
    if (compNames) {
        hash.comp = {
            lowerCaseName: compNames.lowerCaseName,
            kebabCaseName: compNames.kebabCaseName,
            startCaseName: compNames.startCaseName,
            camelCaseName: compNames.camelCaseName
        };
    }
    return hash;
};

/**
 * 获取所有环境变量.env文件的文件名组成的数组
 * @returns array 环境变量数组
 */
exports.getEnvNames = function getEnvNames() {
    let arrs = [];
    let envPath = path.join(yicodePaths.srcDir, 'env');
    if (fs.existsSync(envPath)) {
        let envs = fs.readdirSync(envPath, { withFileTypes: true });
        envs.forEach((file) => {
            if (file.isFile() === true) {
                arrs.push(path.basename(file.name, '.env'));
            }
        });
        return arrs;
    } else {
        return [];
    }
};

// 判断目录是否为空
exports.isEmptyDirectory = function isEmptyDirectory(path) {
    return fs.readdirSync(path).length === 0;
};

exports.print = function print(strs) {
    let chalkArray = [
        //
        chalk.yellowBright(' [ '),
        chalk.yellowBright(strs),
        chalk.yellowBright(' ] ')
    ];
    return chalkArray.join('');
};
