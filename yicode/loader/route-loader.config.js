import { resolve } from 'path';
import { __dirname } from '../utils.js';
export default {
    loader: resolve(__dirname(import.meta.url), 'route-loader.cjs'),
    options: {}
};
