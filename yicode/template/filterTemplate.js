module.exports = `import Vue from 'vue';
Vue.filter('<%= names.startCaseName %>', function (value) {
    return value + ' 过滤器 <%= names.startCaseName %>';
});
`;
