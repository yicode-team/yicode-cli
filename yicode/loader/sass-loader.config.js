import path from 'path';
import * as yicodePaths from '../paths.js';
export default {
    loader: 'sass-loader',
    options: {
        sourceMap: process.env.NODE_MODE === 'development' ? true : false,
        additionalData: `@use "@/styles/variable.scss" as *;`
    }
};
