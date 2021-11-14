export default `
<template>
    <<%= aliasNames.tag %> class="comp-<%= names.lowerCaseName %>">
        comp-<%= names.lowerCaseName %>
    </<%= aliasNames.tag %>>
</template>

<script>
export default {
    name: "<%= names.startCaseName %>",
    data(){
        return {};
    },
    created(){
        this.init();
    },
    mounted(){},
    methods:{
        // 页面初始化操作
        init() {},
        // 通用简单事件注册中心
        on(){

        },
    }
};
</script>

<style lang="scss" scoped>
.comp-<%= names.lowerCaseName %> {
}
</style>
`;
