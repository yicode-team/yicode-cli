export const pageTemplate = `<template>
    <div class="page-<%= fileNames.kebabCaseName %>">
        <%= fileNames.kebabCaseName %>
    </div>
</template>
<script>
export default {
    name: "<%= fileNames.startCaseName %>",
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
.page-<%= fileNames.kebabCaseName %> {
}
</style>
`;
