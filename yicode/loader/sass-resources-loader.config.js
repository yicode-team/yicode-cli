import { resolve } from 'path';
import { srcDir } from '../paths.js';
export default {
    loader: 'sass-resources-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false,
        resources: [resolve(srcDir, 'styles', 'variable.scss')]
    }
};
