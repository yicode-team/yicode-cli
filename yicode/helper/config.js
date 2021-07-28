// 外部模块
let os = require('os');
let path = require('path');
let fs = require('fs-extra');
let _ = require('lodash');
let schemeUtils = require('schema-utils');

// 内部模块
let yicodePaths = require('./paths.js');
let yicodeScheme = require('./scheme.js');

// 项目配置路径
let projectConfigPath = path.join(yicodePaths.rootDir, 'yicode.config.js');
let projectConfig = {};

// 工具配置路径
let yicodeCacheConfig = require(path.resolve(yicodePaths.cliDir, 'cache', 'yicode.config.json'));

/**
 * 如果项目路径存在，则导入该配置
 */
if (fs.pathExists(projectConfigPath) === true) {
    try {
        projectConfig = require(projectConfigPath);
        if (_.isObject(projectConfig) === false) {
            console.log('yicode.config.js文件必须导出一个对象');
            process.exit(1);
        }
    } catch (err) {
        console.log('yicode.config.js文件必须导出一个对象');
        console.log(err);
        process.exit(1);
    }
}

let yicodeConfig = {
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
    providePlugin: {},
    externals: {},
    // 开发配置
    devServer: {},
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
            cacheLocation: path.join(yicodePaths.rootDir, '.cache', '.eslintcache'),
            overrideConfigFile: path.join(yicodePaths.cliDir, '.eslintrc.js'),
            // 只检测改变的文件，一开始启动不检测
            lintDirtyModulesOnly: true,
            // 并行数量
            threads: os.cpus().length
        }
    },
    stylelint: {
        options: {
            configFile: path.join(yicodePaths.cliDir, 'stylelint.config.js'),
            context: yicodePaths.srcDir,
            configBasedir: yicodePaths.cliDir,
            cache: true,
            fix: true,
            cacheLocation: path.join(yicodePaths.rootDir, '.cache'),
            // 只检测改变的文件
            lintDirtyModulesOnly: true
        }
    }
};

// schemeUtils.validate(yicodeScheme, yicodeConfig, { name: '[ yicode.config.js ]' });

// 配置合并
let AllConfig = _.merge(yicodeConfig, projectConfig, yicodeCacheConfig);
module.exports = AllConfig;
