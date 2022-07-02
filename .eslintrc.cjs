const path = require('path');
const localPkg = require('local-pkg');
// const yicodePaths = localPkg.importModule('./yicode/paths.js');
module.exports = {
    // 找到当前目录就不往上找了
    root: true,
    parser: 'vue-eslint-parser',
    env: {
        es6: true,
        browser: true,
        node: true,
        es2017: false
    },
    parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 2016,
        sourceType: 'module',
        // 指定babel的参数 https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser#additional-parser-configuration
        babelOptions: {
            configFile: path.resolve(__dirname, 'babel.config2.cjs')
        }
    },
    plugins: [
        //
        '@babel/eslint-plugin',
        'eslint-plugin-vue',
        'eslint-plugin-prettier'
    ],
    extends: [
        //
        'plugin:vue/recommended',
        'eslint:recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                trailingComma: 'none',
                tabWidth: 4,
                semi: true,
                singleQuote: true,
                printWidth: 1024,
                bracketSpacing: true,
                useTabs: false,
                arrowParens: 'always'
            },
            {
                usePrettierrc: false
            }
        ],
        'no-unused-vars': 'off',
        'no-var': 'warn',
        eqeqeq: 'warn',
        'vue/component-tags-order': [
            'warn',
            {
                order: ['template', 'script', 'style']
            }
        ],
        'vue/multi-word-component-names': 'off',
        'vue/html-end-tags': 'warn',
        'vue/html-self-closing': [
            'warn',
            {
                html: {
                    void: 'any',
                    normal: 'any',
                    component: 'any'
                },
                svg: 'always',
                math: 'always'
            }
        ],
        'vue/prop-name-casing': ['warn', 'camelCase'],
        'vue/require-default-prop': 'warn',
        'vue/order-in-components': [
            'warn',
            {
                order: [
                    //
                    'el',
                    'name',
                    'key',
                    'parent',
                    'functional',
                    'delimiters',
                    'comments',
                    'components',
                    'directives',
                    'filters',
                    'extends',
                    'mixins',
                    'provide',
                    'inject',
                    'ROUTER_GUARDS',
                    'layout',
                    'middleware',
                    'validate',
                    'scrollToTop',
                    'transition',
                    'loading',
                    'inheritAttrs',
                    'model',
                    'props',
                    'propsData',
                    'emits',
                    'setup',
                    'asyncData',
                    'data',
                    'fetch',
                    'head',
                    'computed',
                    'watch',
                    'watchQuery',
                    'LIFECYCLE_HOOKS',
                    'methods',
                    'template',
                    'render',
                    'renderError'
                ]
            }
        ]
    }
};
