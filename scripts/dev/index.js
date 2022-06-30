// 自带模块
import path from 'path';

import fs from 'fs-extra';
import Webpack from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import portfinder from 'portfinder';
import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import updateNotifier from 'update-notifier';
import webpackDevServer from 'webpack-dev-server';

// 配置相关
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
import * as yicodePkgs from '../../yicode/package.js';
import yicodeConfig from '../../yicode/config.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

let defaultDevServer = {
    allowedHosts: 'all',
    bonjour: false,
    client: {
        logging: 'none',
        // logging: 'info',
        progress: false,
        reconnect: 10
    },
    compress: true,
    devMiddleware: {
        index: 'index.html',
        writeToDisk: false,
        publicPath: '/',
        serverSideRender: false
    },
    // headers: {},
    host: '127.0.0.1',
    hot: true,
    http2: false,
    https: false,
    // ipc: {},
    liveReload: true,
    magicHtml: false,
    open: false,
    port: '',
    // proxy: {},
    static: {
        directory: yicodePaths.staticDir,
        staticOptions: {},
        publicPath: '/static/',
        serveIndex: true,
        watch: true
    },
    setupExitSignals: false
};

// 导出函数
export async function devMain(options) {
    // 开发环境的webpack配置参数
    let { webpackConfig } = await import(yicodeUtils.relativePath(yicodeUtils.fn_dirname(import.meta.url), path.resolve(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.dev.js')));

    // 默认的devServer配置参数

    // 合并开发服务配置参数
    let devServerConfig = webpackMerge(defaultDevServer, yicodeConfig?.webpackConfig?.devServer || {});

    // 如果port没有值，则从8000 - 9000端口中选择一个
    if (!devServerConfig.port) {
        devServerConfig.port = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });
    }

    // 判断协议类型
    let protocol = devServerConfig.https === true ? 'https' : 'http';

    // 追加友好错误提示插件
    friendlyErrorsConfig.compilationSuccessInfo.messages.push(`应用已启动：${protocol}://${devServerConfig.host}:${devServerConfig.port}`);
    friendlyErrorsConfig.compilationSuccessInfo.notes.unshift('官方文档：[ https://yicode.site ]');

    webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin(friendlyErrorsConfig));

    let compiler = await Webpack(webpackConfig);
    let server = new webpackDevServer(devServerConfig, compiler);
    await server.start();

    // server.listen(devServerConfig.port, devServerConfig.host, () => {
    // console.log(`开发环境已启动：${protocol}://${devServerConfig.host}:${port}`);
    // });
}
