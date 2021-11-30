export const componentTemplate = `<template>
    <div class="comp-<%= lowerCaseName %>">
        comp-<%= lowerCaseName %>
    </div>
</template>

<script>
export default {
    name: "Comp<%= startCaseName %>",
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
.comp-<%= lowerCaseName %> {
}
</style>
`;
