import { cliDir, rootDir } from './yicode/paths.js';
export default {
    options: {
        // 是否使用本地安装的包 npm i xxx , execa('xxx')
        preferLocal: true,
        // 本地包的bin地址
        localDir: cliDir,
        // 当前工作目录
        cwd: rootDir
    }
};
