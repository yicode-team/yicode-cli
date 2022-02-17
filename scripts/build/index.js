// 导入模块
import { resolve, basename, join } from 'path';

import Webpack from 'webpack';

import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';

// 配置相关
import { cliDir } from '../../yicode/paths.js';
import { relativePath, getEnvNames, fn_firname } from '../../yicode/utils.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

export async function buildMain() {
    let { webpackConfig } = await import(relativePath(fn_firname(import.meta.url), resolve(cliDir, 'yicode', 'webpack', 'webpack.config.build.js')));

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
