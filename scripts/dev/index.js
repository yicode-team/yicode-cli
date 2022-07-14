// 自带模块
import path from 'path';

import fs from 'fs-extra';
import Webpack from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import portfinder from 'portfinder';
import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import updateNotifier from 'update-notifier';
import webpackDevServer from 'webpack-dev-server';
import shell from 'shelljs';
import { createServer } from 'vite';

// 配置相关
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
import * as yicodePkgs from '../../yicode/package.js';
import { yicodeConfig } from '../../yicode/config.js';
import { yicodeConstant } from '../../yicode/constant.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

// 导出函数
export async function main(promptParams) {
    // 默认使用开发者模式
    shell.env['NODE_MODE'] = 'development';
    // 选择的环境变量文件
    shell.env['NODE_ENV_FILE'] = promptParams.envFile;
    // 是否启动分析模式
    // shell.env['NODE_ANALYZER'] = promptParams.isAnalyzer;

    // 如果是vite项目，则使用vite启动
    if (promptParams.isViteProject === true) {
        let port = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });

        const server = await createServer({
            // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
            configFile: path.resolve(yicodePaths.cliDir, 'yicode', 'vite', 'vite.config.js'),
            server: {
                port: port
            }
        });
        await server.listen();

        server.printUrls();
    } else {
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

        let webpackConfigPath = yicodeUtils.getFileProtocolPath(path.resolve(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.dev.js'));

        // 开发环境的webpack配置参数
        let { webpackConfig = {} } = await yicodeUtils.importModule(webpackConfigPath, {});

        // 默认的devServer配置参数

        // 合并开发服务配置参数
        let devServerConfig = webpackMerge(defaultDevServer, yicodeConfig?.webpack?.devServer || {});

        // 如果port没有值，则从8000 - 9000端口中选择一个
        if (!devServerConfig.port) {
            devServerConfig.port = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });
        }

        // 判断协议类型
        let protocol = devServerConfig.https === true ? 'https' : 'http';

        // 追加友好错误提示插件
        friendlyErrorsConfig.compilationSuccessInfo.messages.push(`应用已启动：${protocol}://${devServerConfig.host}:${devServerConfig.port}`);
        friendlyErrorsConfig.compilationSuccessInfo.notes.unshift('官方文档：[ https://chensuiyi.com ]');

        webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin(friendlyErrorsConfig));

        let compiler = await Webpack(webpackConfig);
        let server = new webpackDevServer(devServerConfig, compiler);
        await server.start();
    }
}
