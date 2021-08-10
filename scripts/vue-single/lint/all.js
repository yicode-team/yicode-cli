let execa = require('execa');
let eslint = require('eslint');
let path = require('path');
let stylelint = require('stylelint');
// DOTO: 去除ololog依赖
let ololog = require('ololog');
let myConfig = require('../../yicode/yicode.paths.js');
let execaConfig = require(path.join(myConfig.cliDir, 'execa.config.js'));
module.exports = async function lintScript(cmd) {
    let configPath = path.join(myConfig.cliDir, '.eslintrc.js');
    let projectPath = myConfig.srcDir;
    // execa
    //     .command(`eslint --format=codeframe -c=${configPath} ${projectPath}`, execaConfig.options)
    //     .then((res) => {
    //         process.stdout.write(res.stdout);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    stylelint
        .lint({
            configFile: path.join(myConfig.cliDir, 'stylelint.config.js'),
            context: myConfig.srcDir,
            configBasedir: myConfig.cliDir,
            cache: true,
            fix: false,
            cacheLocation: path.join(myConfig.rootDir, '.cache'),
            // 只检测改变的文件
            lintDirtyModulesOnly: false,
            globbyOptions: myConfig.srcDir,
            files: ['**/*.scss', '!**/node_modules']
            // formatter: 'verbose'
        })
        .then(function (resultObject) {
            console.dir(JSON.parse(resultObject.output));
        });
};
