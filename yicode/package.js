// 外部模块
import { resolve } from 'path';
import fs from 'fs-extra';

// 内部模块
import { cliDir, rootDir } from './paths.js';

export const yicodePackage = fs.readJSONSync(resolve(cliDir, 'package.json'), { throws: false }) || {};
export const projectPackage = fs.readJSONSync(resolve(rootDir, 'package.json'), { throws: false }) || {};
