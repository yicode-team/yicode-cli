import path from 'path';
import shell from 'shelljs';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';

let rootDir = path.resolve(process.cwd());
let srcDir = path.resolve(rootDir, 'src');
// import Unocss from 'unocss/vite';
// import * as yicodePaths from '../paths.js';
// import * as yicodeUtils from '../utils.js';
// import {
//     //
//     presetUno,
//     presetMini,
//     presetWind,
//     presetAttributify,
//     presetIcons,
//     presetWebFonts,
//     presetTypography
// } from 'unocss';

// TODO: 完成图标使用方案

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(shell.env['NODE_ENV_FILE'], path.resolve(process.cwd(), 'src', 'env'));
    return {
        plugins: [
            //
            vue(),
            AutoImport({
                include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
                imports: ['vue', '@vueuse/core'],
                dirs: [
                    //
                    path.resolve(srcDir, 'components'),
                    path.resolve(srcDir, 'hooks')
                ],
                vueTemplate: true
            }),
            Components({
                directoryAsNamespace: true,
                resolvers: [
                    //
                    // IconsResolver(),
                    NaiveUiResolver()
                ]
            }),
            visualizer({
                open: false,
                brotliSize: true,
                filename: 'buildReport.html'
            })
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/variable.scss" as *;`
                }
            }
        },
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: path.resolve(srcDir)
                }
            ]
        },
        envDir: path.resolve(srcDir, 'env'),
        build: {
            rollupOptions: {
                plugins: []
            }
        }
    };
});
