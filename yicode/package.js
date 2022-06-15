// 外部模块
import path from 'path';
import fs from 'fs-extra';

// 内部模块
import * as yicodePaths from './paths.js';

export const yicodePackage = fs.readJSONSync(path.resolve(yicodePaths.cliDir, 'package.json'), { throws: false }) || {};
export const projectPackage = fs.readJSONSync(path.resolve(yicodePaths.rootDir, 'package.json'), { throws: false }) || {};
