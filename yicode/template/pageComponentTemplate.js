export const componentTemplate = `<template>
    <div class="c-<%= lowerCaseName %>">
        comp-<%= lowerCaseName %>
    </div>
</template>

<script>
export default {
    name: "<%= startCaseName %>",
    data(){
        return {};
    },
    created(){
    },
    mounted(){},
    methods:{
        // 通用简单事件注册中心
        on(){

        },
    }
};
</script>

<style lang="scss" scoped>
.c-<%= lowerCaseName %> {
}
</style>
`;
