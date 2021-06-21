let fs = require('fs');
let execa = require('execa');
let eslint = require('eslint');
let path = require('path');
let stylelint = require('stylelint');
// DOTO: 去除ololog依赖
let ololog = require('ololog');
let myConfig = require('../../yicode/yicode.paths.js');
let execaConfig = require(path.join(myConfig.cliDir, 'execa.config.js'));
module.exports = async function format(file) {
    let configPath = path.join(myConfig.cliDir, 'prettier.config.js');
    let projectPath = myConfig.srcDir;
    let dd = execa
        .command(`prettier --config=${configPath} --write=${file}`, execaConfig.options)
        .then((res) => {
            fs.writeFileSync('./1.txt', res.stdout);
            process.stdout.write(res.stdout);
            dd.killed;
        })
        .catch((err) => {
            console.log(err);
        });
};
