let myConfig = require('./yicode/yicode.paths.js');
module.exports = {
    options: {
        // 是否使用本地安装的包 npm i xxx , execa('xxx')
        preferLocal: true,
        // 本地包的bin地址
        localDir: myConfig.cliDir,
        // 当前工作目录
        cwd: myConfig.rootDir
    }
};
