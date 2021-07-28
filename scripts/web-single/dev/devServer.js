// 自带模块
let path = require('path');
// 配置相关
let yicodePaths = require('../../../yicode/helper/paths.js');
let yicodePackage = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'package.js'));
let yicodeConfig = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'config.js'));
let yicodeUtils = require(path.resolve(yicodePaths.cliDir, 'yicode', 'helper', 'utils.js'));

module.exports = {
    allowedHosts: 'all',
    bonjour: false,
    client: {
        logging: 'none',
        overlay: true,
        progress: true,
        webSocketURL: {}
    },
    compress: true,
    devMiddleware: {
        index: 'index.html',
        writeToDisk: false,
        publicPath: '/',
        serverSideRender: false
    },
    http2: false,
    https: false,
    host: '127.0.0.1',
    hot: 'only',
    liveReload: true,
    open: false,
    port: '',
    static: {
        directory: path.resolve(yicodePaths.srcDir, 'static'),
        staticOptions: {},
        publicPath: '/static/',
        serveIndex: true,
        watch: true
    }
};
