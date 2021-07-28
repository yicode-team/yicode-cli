// 导入模块
let path = require('path');
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let shell = require('shelljs');
let { table } = require('table');
let FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');

// 配置相关
let yicodePaths = require('../../../yicode/helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

module.exports = async function build(cmd) {
    shell.env['NODE_MODE'] = 'production';
    shell.env['NODE_ANALYZER'] = cmd.analyzer;
    shell.env['NODE_ENV_FILE'] = cmd.env;

    let webpackConfig = require(path.join(yicodePaths.cliDir, 'yicode', 'webpack', 'webpack.config.build.js'));
    webpackConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`项目编译成功`],
                notes: ['请将/dist目录下的文件发布到服务器']
            }
        })
    );
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err);
        } else {
            // let fileds = [
            //     //
            //     'name',
            //     'startTime',
            //     'endTime',
            //     'bail',
            //     'profile',
            //     'errors'
            // ];
            // let result = _.pick(stats.compilation, fileds);
            // console.log(result);
        }
    });
};
