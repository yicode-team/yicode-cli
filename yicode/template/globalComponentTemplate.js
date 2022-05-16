export const componentTemplate = `<template>
    <div class="g-<%= kebabCaseName %>">
        <%= kebabCaseName %>
    </div>
</template>

<script>
export default {
    name: "G<%= startCaseName %>",
    data(){
        return {

        };
    },
    created(){

    },
    mounted(){

    },
    methods:{
        on(){

        },
    }
};
</script>

<style lang="scss" scoped>
.g-<%= kebabCaseName %> {
}
</style>
`;
