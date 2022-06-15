// 自带模块
import path from 'path';
import fs from 'fs-extra';
import { createServer } from 'vite';
import portfinder from 'portfinder';
import updateNotifier from 'update-notifier';

// 配置相关
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
import { yicodePackage } from '../../yicode/package.js';
import yicodeConfig from '../../yicode/config.js';

// 导出函数
export async function devMain(options) {
    // 开发环境的webpack配置参数
    let viteConfig = await import(yicodeUtils.relativePath(yicodeUtils.fn_firname(import.meta.url), path.resolve(yicodePaths.cliDir, 'yicode', 'vite', 'vite.config.js')));

    // 判断协议类型
    // let protocol = devServerConfig.https === true ? 'https' : 'http';

    const server = await createServer({
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: path.resolve(yicodePaths.cliDir, 'yicode', 'vite', 'vite.config.js'),
        root: yicodePaths.srcDir,
        server: {
            port: 1337
        }
    });
    await server.listen();

    server.printUrls();
}
