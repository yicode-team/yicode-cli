// 导入模块
import path from 'path';

import Webpack from 'webpack';

import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';

// 配置相关
import * as yicodePaths from '../../yicode/paths.js';
import * as yicodeUtils from '../../yicode/utils.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

export async function buildMain() {
    let { webpackConfig } = await import(yicodeUtils.relativePath(yicodeUtils.fn_firname(import.meta.url), path.resolve(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.build.js')));

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
