let path = require('path');
let yicodePaths = require('../helper/paths.js');

module.exports = {
    loader: 'babel-loader',
    options: {
        cwd: yicodePaths.cliDir,
        root: yicodePaths.cliDir,
        rootMode: 'upward',
        configFile: path.join(yicodePaths.cliDir, 'babel.config.js'),
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
