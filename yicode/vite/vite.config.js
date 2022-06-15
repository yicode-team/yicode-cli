import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
// import Pages from 'vite-plugin-pages';
// import Layouts from 'vite-plugin-vue-layouts';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import Icons from 'unplugin-icons/vite';
// import IconsResolver from 'unplugin-icons/resolver';
// import Unocss from 'unocss/vite';
import * as yicodePaths from '../paths.js';
import * as utils from '../utils.js';

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
        vue()
    ]
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: `@use "@/styles/variable.scss" as *;`
    //         }
    //     }
    // }
    // envDir: path.resolve(yicodePaths.srcDir, 'env')
});
