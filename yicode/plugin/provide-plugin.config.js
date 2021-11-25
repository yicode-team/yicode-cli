// 自带模块
let { isObject } = require('lodash-es');
// 自带库枚举
let pluginMap = {};
let yicodeConfig = require('../yicode.config.js');
let propObject = {};
if (isObject(yicodeConfig.lib)) {
    for (let prop in yicodeConfig.lib) {
        if (yicodeConfig.lib.hasOwnProperty(prop) && pluginMap[prop]) {
            propObject = { ...propObject, ...pluginMap[prop] };
        }
    }
}
module.exports = propObject;
