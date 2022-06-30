import path from 'path';
import { defineConfig } from 'vite';
// import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
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

export default defineConfig({
    plugins: [
        //
        vue(),
        AutoImport({
            include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
            imports: ['vue', '@vueuse/core'],
            // dirs: ['./src/hooks'],
            vueTemplate: true
        }),
        Components({
            directoryAsNamespace: true,
            resolvers: [
                //
                IconsResolver(),
                NaiveUiResolver()
            ]
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
        alias: {
            '@': path.resolve(process.cwd(), 'src')
        }
    }
    // envDir: path.resolve(yicodePaths.srcDir, 'env')
});
