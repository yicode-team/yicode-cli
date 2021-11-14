// 导入模块
import { resolve, basename, join } from 'path';
import { merge } from 'lodash-es';
import Webpack from 'webpack';
import shell from 'shelljs';
import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import inquirer from 'inquirer';

// 配置相关
import { cliDir } from '../../yicode/paths.js';
import { relativePath, getEnvNames, __dirname } from '../../yicode/utils.js';
import friendlyErrorsConfig from '../../yicode/plugin/friendly-errors.config.js';

// 提示参数收集
let promptParams = {};

async function runProduction() {
    let { webpackConfig } = await import(relativePath(__dirname(import.meta.url), resolve(cliDir, 'yicode', 'webpack', 'webpack.config.build.js')));

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
export async function main(options) {
    // 使用产品模式
    shell.env['NODE_MODE'] = 'production';
    promptParams = merge(promptParams, options);

    /**
     * ==========================================
     * 选择环境变量文件
     * ==========================================
     */
    const _envFile = await inquirer.prompt([
        {
            type: 'list',
            name: 'envFile',
            choices: getEnvNames(),
            message: '选择使用的环境变量文件'
        }
    ]);
    promptParams = merge(promptParams, _envFile);

    // 选择的环境变量文件
    shell.env['NODE_ENV_FILE'] = promptParams.envFile;

    /**
     * ==========================================
     * 选择是否启动分析模式
     * ==========================================
     */
    const _isAnalyzer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'isAnalyzer',
            message: '是否启动分析模式？（默认：否）',
            default: false
        }
    ]);
    promptParams = merge(promptParams, _isAnalyzer);
    // 是否启动分析模式
    shell.env['NODE_ANALYZER'] = promptParams.isAnalyzer;

    // 开发脚本
    runProduction();
}
