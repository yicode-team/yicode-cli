// 自带模块
let path = require('path');
// 第三方模块
let _ = require('lodash');
let fs = require('fs-extra');
let webpack = require('webpack');
let shell = require('shelljs');
let { table } = require('table');
let FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// 配置相关
let myConfig = require('../../yicode/yicode.paths.js');
let yicodePackage = require('../../package.json');
let yicodeConfig = require('../../yicode/yicode.config.js');
module.exports = async function build(cmd) {
    shell.env['NODE_MODE'] = 'production';
    shell.env['NODE_ANALYZER'] = cmd.analyzer;
    shell.env['NODE_ENV_FILE'] = cmd.env;
    let webpackConfig = require(path.join(myConfig.cliDir, 'yicode', 'webpack.config.pro.js'));
    webpackConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`项目编译成功`],
                notes: ['请将dist目录下的文件发布到服务器']
            }
        })
    );
    webpack(webpackConfig, (err, stats) => {
        /**
             * stats.compilation
             * hooks
                name
                startTime
                endTime
                compiler
                resolverFactory
                inputFileSystem
                fileSystemInfo
                requestShortener
                compilerPath
                logger
                options
                outputOptions
                bail
                profile
                mainTemplate
                chunkTemplate
                runtimeTemplate
                moduleTemplates
                moduleGraph
                chunkGraph
                codeGenerationResults
                factorizeQueue
                addModuleQueue
                buildQueue
                rebuildQueue
                processDependenciesQueue
                creatingModuleDuringBuild
                entries
                globalEntry
                entrypoints
                asyncEntrypoints
                chunks
                chunkGroups
                namedChunkGroups
                namedChunks
                modules
                _modules
                records
                additionalChunkAssets
                assets
                assetsInfo
                _assetsRelatedIn
                errors
                warnings
                children
                logging
                dependencyFactories
                dependencyTemplates
                childrenCounters
                usedChunkIds
                usedModuleIds
                needAdditionalPass
                builtModules
                codeGeneratedModules
                _rebuildingModules
                emittedAssets
                comparedForEmitAssets
                fileDependencies
                contextDependencies
                missingDependencies
                buildDependencies
                compilationDependencies
                _modulesCache
                _assetsCache
                _codeGenerationCache
                fullHash
                hash
             */
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
