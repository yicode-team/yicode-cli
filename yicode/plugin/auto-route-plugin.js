// TODO: 生成后不能立即刷新，还需要后续再处理
import fg from 'fast-glob';
import fs from 'fs-extra';
import { resolve, relative } from 'path';
import { keyBy } from 'lodash-es';
import vtc from 'vue-template-compiler';
import prettier from 'prettier';
import clearModule from 'clear-module';
import { nanoid } from 'nanoid';
import md5 from 'md5';
//  配置文件
import { pageDir, cacheDir, srcDir, rootDir } from '../paths.js';
// 确保缓存目录存在
fs.ensureDirSync(cacheDir);
export default class RoutePlugin {
    // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
    apply(compiler) {
        // 指定一个挂载到 webpack 自身的事件钩子。
        compiler.hooks.thisCompilation.tap('autoRoutePlugin', (compilation) => {
            let dirData = fg.sync(['**/*'], {
                cwd: srcDir,
                dot: true,
                absolute: true,
                objectMode: false,
                onlyDirectories: true,
                onlyFiles: false
                // ignore: ['**/node_modules/*']
            });
            let fileData = fg.sync(['**/*'], {
                cwd: srcDir,
                dot: true,
                absolute: true,
                objectMode: false,
                onlyDirectories: false,
                onlyFiles: true
                // ignore: ['**/node_modules/*']
            });
            dirData.forEach((dir) => {
                if (!compilation.contextDependencies.has(dir)) {
                    compilation.contextDependencies.add(dir);
                }
            });
            fileData.forEach((file) => {
                if (!compilation.fileDependencies.has(file)) {
                    compilation.fileDependencies.add(file);
                }
            });
            let vueFiles = fg.sync(['**/*.vue'], {
                cwd: pageDir,
                ignore: ['**/components'],
                caseSensitiveMatch: false,
                absolute: true
            });
            let cacheRoute = [];
            vueFiles.forEach((file) => {
                let fileData = fs.readFileSync(file, { encoding: 'utf8' });
                let res = vtc.parseComponent(fileData);
                let customBlocksByType = keyBy(res.customBlocks, 'type');
                let routeData = customBlocksByType?.route?.content;
                if (routeData) {
                    try {
                        cacheRoute.push(routeData.replace(/\'/gi, '"'));
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
            fs.writeFileSync(resolve(cacheDir, `routes.js`), `export default [${cacheRoute.join(',')}]`);
        });
    }
}
