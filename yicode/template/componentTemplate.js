export const componentTemplate = `<template>
    <div class="global-component-<%= kebabCaseName %>">
        <%= kebabCaseName %>
    </div>
</template>

<script>
export default {
    name: "GlobalComponent<%= startCaseName %>",
    data(){
        return {

        };
    },
    created(){

    },
    mounted(){

    },
    methods:{

    }
};
</script>

<style lang="scss" scoped>
.global-component-<%= kebabCaseName %> {
}
</style>
`;
