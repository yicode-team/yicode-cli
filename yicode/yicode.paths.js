let path = require('path');

// yicode命令路径
let cliDir = path.join(__dirname, '..');
// 项目根目录路径
let rootDir = path.join(process.cwd());
// 项目源码路径
let srcDir = path.join(rootDir, 'src');
// 项目页面路径
let pageDir = path.join(srcDir, 'pages');
// 项目打包路径
let distDir = path.join(rootDir, 'dist');
// webpack配置路径
let webpackDir = path.join(cliDir, 'yicode');
// 临时文件路径
let tempDir = path.join(rootDir, 'temp');
// 项目缓存路径
let cacheDir = path.join(rootDir, '.cache');

module.exports = {
    cliDir,
    rootDir,
    srcDir,
    pageDir,
    distDir,
    webpackDir,
    cacheDir,
    tempDir
};
