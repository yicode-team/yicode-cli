// 自带模块
let _ = require('lodash');
// 自带库枚举
let pluginMap = {
    lodash: {
        _: 'lodash'
    },
    dayjs: {
        dayjs: 'dayjs'
    }
};
let yicodeConfig = require('../yicode.config.js');
let propObject = {};
if (_.isObject(yicodeConfig.lib)) {
    for (let prop in yicodeConfig.lib) {
        if (yicodeConfig.lib.hasOwnProperty(prop) && pluginMap[prop]) {
            propObject = { ...propObject, ...pluginMap[prop] };
        }
    }
}
module.exports = propObject;
