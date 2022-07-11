#!/usr/bin/env node
import init from './scripts/prompt.js';
import { yicodeConfig } from './yicode/config.js';
let commandParam = yicodeConfig?.commandLine?.[process.argv[2]];

if (commandParam) {
    let script = commandParam?.executeCommand;
    if (['dev', 'build', 'devVite', 'buildVite'].includes(script)) {
        let { main } = await import(`./scripts/${script}/index.js`);
        main(commandParam);
    } else {
        console.log('打包命令无效');
    }
} else {
    init();
}
