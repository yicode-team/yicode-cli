// 外部模块
import path from 'path';
import url from 'url';
import * as _ from 'lodash-es';
import fs from 'fs-extra';
import chalk from 'chalk';
import Downloader from 'nodejs-file-downloader';
import ora from 'ora';

import fastGlob from 'fast-glob';
import { createRequire } from 'module';

// 配置相关
import * as yicodePaths from './paths.js';

// 下载项目
export function downloadProject(options) {
    const spinner = ora('Loading unicorns').start('模板下载中');
    return new Promise(async (resolve, reject) => {
        try {
            const downloader = new Downloader({
                url: options.url,
                directory: yicodePaths.tempDir,
                fileName: options.filename,
                cloneFiles: false,
                maxAttempts: 3,
                onProgress: function (percentage, chunk, remainingSize) {
                    if (remainingSize === 0) {
                        spinner.succeed('下载成功');
                    }
                }
            });
            let res = await downloader.download();
            resolve(res);
        } catch (err) {
            spinner.fail('下载失败');
            reject(err);
        }
    });
}

export function getFileNames(name) {
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
}

/**
 * 获取所有环境变量.env文件的文件名组成的数组
 * @returns array 环境变量数组
 */
export function getEnvNames(promptParams) {
    if (promptParams.isViteProject === true) {
        let envFiles = fastGlob
            .sync('.env.*', {
                dot: true,
                absolute: false,
                cwd: path.resolve(yicodePaths.srcDir, 'env'),
                onlyFiles: true,
                ignore: ['.env.*.local']
            })
            .map((fileName) => {
                return {
                    value: fileName.replace('.env.', ''),
                    name: fileName
                };
            });
        return envFiles;
    } else {
        let envFiles = fastGlob
            .sync('*.js', {
                dot: false,
                absolute: false,
                cwd: path.resolve(yicodePaths.srcDir, 'env'),
                onlyFiles: true
            })
            .map((fileName) => {
                return {
                    value: path.basename(fileName, '.js'),
                    name: fileName
                };
            });
        return envFiles;
    }
}

/**
 * 获取所有环境变量.env文件的文件名组成的数组
 * @returns array 环境变量数组
 */
export function getViteEnvNames() {
    let envFiles = fastGlob
        .sync('*', {
            dot: true,
            absolute: false,
            cwd: path.resolve(yicodePaths.srcDir, 'env'),
            onlyFiles: true
        })
        .map((fileName) => {
            return {
                value: fileName,
                name: fileName
            };
        });
    return envFiles;
}

// 判断目录是否为空
export function isEmptyDirectory(path) {
    return fs.readdirSync(path).length === 0;
}

export function print(strs) {
    let chalkArray = [
        //
        chalk.greenBright(' [ '),
        chalk.greenBright(strs),
        chalk.greenBright(' ] ')
    ];
    return chalkArray.join('');
}

// 获取file协议的路径
export function getFileProtocolPath(_path) {
    if (_.startsWith(_path, 'file:')) {
        return _path;
    } else {
        return 'file://' + path.normalize(_path);
    }
}

export function relativePath(from, to) {
    let _relative = path.relative(from, to);
    let _covertPath = _relative.replace(/\\+/g, '/');

    // 如果第一个不是（.），则自动拼接点
    if (_covertPath.indexOf('.') !== 0) {
        _covertPath = './' + _covertPath;
    }
    return _covertPath;
}

export function fn_filename(metaUrl) {
    return url.fileURLToPath(metaUrl);
}

export function fn_pureFilename(metaUrl) {
    return path.basename(fn_filename(metaUrl)).split('.')[0];
}

export function fn_dirname(metaUrl) {
    const filename = url.fileURLToPath(metaUrl);
    return path.dirname(filename);
}

export function requireResolve(url, name) {
    return createRequire(url).resolve(name);
}

// 导入ESM或commonjs模块
export async function importModule(path, defaultValue) {
    try {
        let i = await import(path);
        if (i && i.default) {
            return i.default;
        } else {
            return i;
        }
    } catch (err) {
        return defaultValue;
    }
}
