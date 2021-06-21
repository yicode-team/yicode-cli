let execa = require('execa');
let eslint = require('eslint');
let path = require('path');
// DOTO: 去除ololog依赖
let ololog = require('ololog');
let myConfig = require('../../yicode/yicode.paths.js');
let eslintConfig = require(path.join(myConfig.cliDir, 'yicode', 'config', 'eslint.js'));
module.exports = async function lintScript(cmd) {
    let configPath = path.join(myConfig.cliDir, '.eslintrc.js');
    let projectPath = myConfig.srcDir;
    execa
        .command(`eslint --format=codeframe -c=${configPath} ${projectPath}`, eslintConfig.options)
        .then((res) => {
            process.stdout.write(res.stdout);
        })
        .catch((err) => {
            console.log(err);
        });
};
