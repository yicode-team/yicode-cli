import path from 'path';
import * as yicodeUtils from './utils.js';

// yicode命令路径
export const cliDir = path.join(yicodeUtils.fn_dirname(import.meta.url), '..');

// 项目根目录路径
export const rootDir = path.join(process.cwd());

// 项目源码路径
export const srcDir = path.join(rootDir, 'src');

// 静态目录
export const staticDir = path.join(rootDir, 'static');

// 项目页面路径
export const pageDir = path.join(srcDir, 'pages');

// 全局组件路径
export const componentDir = path.join(srcDir, 'components');

// 全局过滤器路径
export const filterDir = path.join(srcDir, 'filters');

// 全局指令路径
export const directiveDir = path.join(srcDir, 'directives');

// 项目打包路径
export const distDir = path.join(rootDir, 'dist');

// webpack配置路径
export const webpackDir = path.join(cliDir, 'yicode');

// 临时文件路径
export const tempDir = path.join(rootDir, '.temp');

// 项目缓存路径
export const cacheDir = path.join(rootDir, '.cache');

// NPM 镜像列表
export const yicodeNpmrc = path.join(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], '.yicode-npmrc');

// NPM 配置地址
export const npmrc = path.join(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], '.npmrc');
