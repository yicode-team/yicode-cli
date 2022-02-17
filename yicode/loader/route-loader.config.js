import { resolve } from 'path';
import { fn_firname } from '../utils.js';
export default {
    loader: resolve(fn_firname(import.meta.url), 'route-loader.cjs'),
    options: {}
};
