// 外部模块
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import * as _ from 'lodash-es';

// 内部模块
import * as yicodePaths from './paths.js';
import * as yicodeUtils from './utils.js';
// let yicodeScheme = require('./scheme.js');

/**
 * 处理yiocde-cli安装位置和项目位置，不在同一个盘符的问题
 * 比如：./D:\codes\project\test1\yicode.config.js
 * 需要去掉前面的 ./
 */
let _relativePath = yicodeUtils.relativePath(yicodeUtils.fn_dirname(import.meta.url), path.resolve(yicodePaths.rootDir, 'yicode.config.js'));
if (_relativePath.indexOf(':') !== -1) {
    _relativePath = _relativePath.replace('./', 'file://');
}

// 项目配置
const { default: projectConfig } = await import(_relativePath);

const yicodeConfig = {
    // 项目类型
    projectType: '',
    /**
     * 描述：是否开启手机自适应模式
     * 默认值：false
     */
    px2viewport: {
        enable: false,
        options: {}
    },
    eslint: {
        options: {
            // 检测根目录
            cwd: yicodePaths.srcDir,
            // 检测的扩展文件
            extensions: ['.js', '.vue'],
            // 解析插件的相对路径，指定为yipck-cli目录，可以减少项目的依赖
            resolvePluginsRelativeTo: yicodePaths.cliDir,
            // 是否自动修复
            fix: false,
            // 修复的类型
            fixTypes: ['problem', 'suggestion', 'layout'],
            // 是否缓存
            cache: true,
            cacheLocation: path.resolve(yicodePaths.rootDir, '.cache', '.eslintcache'),
            overrideConfigFile: path.resolve(yicodePaths.cliDir, '.eslintrc.js'),
            // 只检测改变的文件，一开始启动不检测
            lintDirtyModulesOnly: true,
            // 并行数量
            threads: os.cpus().length
        }
    },
    stylelint: {
        options: {
            configFile: path.resolve(yicodePaths.cliDir, 'stylelint.config.js'),
            context: yicodePaths.srcDir,
            configBasedir: yicodePaths.cliDir,
            cache: true,
            fix: true,
            cacheLocation: path.resolve(yicodePaths.rootDir, '.cache'),
            // 只检测改变的文件
            lintDirtyModulesOnly: true
        }
    },
    webpack: {
        // 全局模块，增加2个默认垫片模块，测试
        providePlugin: {
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        },
        // 外部链接
        externals: {},
        // 开发配置
        devServer: {}
    }
};

// schemeUtils.validate(yicodeScheme, yicodeConfig, { name: '[ yicode.config.js ]' });

// 配置合并
export default _.merge(yicodeConfig, projectConfig);
