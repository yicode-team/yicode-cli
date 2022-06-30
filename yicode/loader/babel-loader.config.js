import path from 'path';
import { cliDir } from '../paths.js';

export default {
    loader: 'babel-loader',
    options: {
        cwd: cliDir,
        root: cliDir,
        rootMode: 'upward',
        cacheDirectory: true,
        configFile: path.resolve(cliDir, 'babel.config.js'),
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
