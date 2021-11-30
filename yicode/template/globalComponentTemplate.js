export const componentTemplate = `<template>
    <div class="g-comp-<%= kebabCaseName %>">
        <%= kebabCaseName %>
    </div>
</template>

<script>
export default {
    name: "GComp<%= startCaseName %>",
    data(){
        return {

        };
    },
    created(){

    },
    mounted(){

    },
    methods:{
        // 通用简单事件注册中心
        on(){

        },
    }
};
</script>

<style lang="scss" scoped>
.g-comp-<%= kebabCaseName %> {
}
</style>
`;
