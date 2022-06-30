import path from 'path';
import * as yicodeUtils from '../utils.js';
export default {
    loader: path.resolve(yicodeUtils.fn_firname(import.meta.url), 'route-loader.cjs'),
    options: {}
};
