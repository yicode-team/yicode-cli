import path from 'path';
import * as yicodePaths from '../paths.js';

export default {
    loader: 'babel-loader',
    options: {
        cwd: yicodePaths.cliDir,
        root: yicodePaths.cliDir,
        rootMode: 'upward',
        cacheDirectory: true,
        configFile: path.resolve(yicodePaths.cliDir, 'babel.config.js'),
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    corejs: '3'
                }
            ]
        ],
        plugins: [
            [
                '@babel/plugin-transform-runtime',
                {
                    absoluteRuntime: false,
                    corejs: 3,
                    helpers: true,
                    regenerator: true,
                    useESModules: false
                }
            ],
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator'
        ]
    }
};
