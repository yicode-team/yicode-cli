// 自带模块
import { resolve, basename } from 'path';

// 第三方模块
import { merge } from 'lodash-es';
import fs from 'fs-extra';
import Webpack from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import portfinder from 'portfinder';
import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import updateNotifier from 'update-notifier';
import webpackDevServer from 'webpack-dev-server';
import shell from 'shelljs';
import inquirer from 'inquirer';

// 配置相关
import { cliDir, srcDir, staticDir, rootDir, distDir } from '../../yicode/paths.js';
import { relativePath, getEnvNames, __dirname } from '../../yicode/utils.js';
import { yicodePackage } from '../../yicode/package.js';
import yicodeConfig from '../../yicode/config.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

// 提示参数收集
let promptParams = {};

let defaultDevServer = {
    allowedHosts: 'all',
    bonjour: false,
    client: {
        logging: 'none',
        // logging: 'verbose',
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
    hot: 'only',
    http2: false,
    https: false,
    // ipc: {},
    liveReload: true,
    magicHtml: false,
    open: false,
    port: '',
    // proxy: {},
    static: {
        directory: staticDir,
        staticOptions: {},
        publicPath: '/static/',
        serveIndex: true,
        watch: true
    },
    setupExitSignals: true
};

// 导出函数
async function runDevelopment() {
    // 开发环境的webpack配置参数
    let { webpackConfig } = await import(relativePath(__dirname(import.meta.url), resolve(cliDir, 'yicode', 'webpack', 'webpack.config.dev.js')));

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

    // return;

    let compiler = await Webpack(webpackConfig);
    let server = new webpackDevServer(devServerConfig, compiler);
    await server.start();

    // server.listen(devServerConfig.port, devServerConfig.host, () => {
    // console.log(`开发环境已启动：${protocol}://${devServerConfig.host}:${port}`);
    // });
}
export async function main(options) {
    promptParams = merge(promptParams, options);
    // 通知更新
    await updateNotifier({ pkg: yicodePackage }).notify();

    // 提示使用的环境变量文件
    let _envFile = await inquirer.prompt([
        {
            type: 'list',
            name: 'envFile',
            choices: getEnvNames(),
            message: '请选择使用的环境变量文件'
        }
    ]);
    promptParams = merge(promptParams, _envFile);
    // 默认使用开发者模式
    shell.env['NODE_MODE'] = 'development';
    // 选择的环境变量文件
    shell.env['NODE_ENV_FILE'] = promptParams.envFile;
    runDevelopment();
}
