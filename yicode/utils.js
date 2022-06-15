// 外部模块
import { resolve, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { toLower, kebabCase, camelCase, replace, startCase } from 'lodash-es';
import fs from 'fs-extra';
import chalk from 'chalk';
import Downloader from 'nodejs-file-downloader';
import ora from 'ora';

import fastGlob from 'fast-glob';
import { createRequire } from 'module';

// 配置相关
import { tempDir, srcDir } from './paths.js';

// 下载项目
export function downloadProject(options) {
    const spinner = ora('Loading unicorns').start('模板下载中');
    return new Promise(async (resolve, reject) => {
        try {
            const downloader = new Downloader({
                url: options.url,
                directory: tempDir,
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
    let lowerCaseName = toLower(name); // hell_o-world
    let kebabCaseName = kebabCase(lowerCaseName); // hell-o-world
    let camelCaseName = camelCase(kebabCaseName); // hellOWorld
    let startCaseName = replace(startCase(camelCaseName), /\s+/g, ''); // HellOWorld

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
export function getEnvNames() {
    let envFiles = fastGlob
        .sync('*.js', {
            dot: false,
            absolute: false,
            cwd: resolve(srcDir, 'env'),
            onlyFiles: true
        })
        .map((fileName) => {
            return {
                value: basename(fileName, '.js'),
                name: fileName
            };
        });
    return envFiles;
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
            cwd: resolve(srcDir, 'env'),
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

export function relativePath(from, to) {
    let _relative = relative(from, to);
    let _covertPath = _relative.replace(/\\+/g, '/');

    // 如果第一个不是（.），则自动拼接点
    if (_covertPath.indexOf('.') !== 0) {
        _covertPath = './' + _covertPath;
    }
    return _covertPath;
}

export function fn_filename(metaUrl) {
    return fileURLToPath(metaUrl);
}

export function fn_pureFilename(metaUrl) {
    return basename(fn_filename(metaUrl)).split('.')[0];
}

export function fn_firname(metaUrl) {
    const filename = fileURLToPath(metaUrl);
    return dirname(filename);
}

export function requireResolve(url, name) {
    return createRequire(url).resolve(name);
}
