export const filterTemplate = `import Vue from 'vue';
Vue.filter('<%= startCaseName %>', function (value) {
    return value + ' 过滤器 <%= startCaseName %>';
});
`;
