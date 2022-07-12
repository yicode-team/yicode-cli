// 导入模块
import path from 'path';
import Webpack from 'webpack';
import shell from 'shelljs';
import { build } from 'vite';

import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';

// 配置相关
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

export async function main(promptParams) {
    // 默认使用开发者模式
    shell.env['NODE_MODE'] = 'production';
    // 选择的环境变量文件
    shell.env['NODE_ENV_FILE'] = promptParams.envFile;
    // 是否启动分析模式
    shell.env['NODE_ANALYZER'] = promptParams.isAnalyzer;

    // 如果是vite项目，则使用vite启动
    if (promptParams.isViteProject === true) {
        await build({
            root: yicodePaths.rootDir,
            base: '',
            build: {
                rollupOptions: {
                    external: /{{.*/
                }
            }
        });
    } else {
        let configPath = yicodeUtils.getFileProtocolPath(path.resolve(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.build.js'));

        // 环境变量
        let { webpackConfig = {} } = await yicodeUtils.importModule(configPath, {});

        // 追加友好错误提示插件
        friendlyErrorsConfig.compilationSuccessInfo.messages.push(`项目编译成功！！！`);
        friendlyErrorsConfig.compilationSuccessInfo.notes.unshift('友情提示：[ 请将 /dist 目录下的文件上传到服务器 ]');
        webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin(friendlyErrorsConfig));

        Webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
