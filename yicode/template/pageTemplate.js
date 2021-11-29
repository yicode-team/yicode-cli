export const pageTemplate = `<template>
    <div class="page-<%= fileNames.kebabCaseName %>">
        <%= fileNames.kebabCaseName %>
    </div>
</template>
<route>
{
    path: '/<%= filePaths.pageRoute %>',
    component: () => import('@/layout/default/index.vue'),
    children: [
        {
            path: '/',
            component: () => import('@/pages/<%= filePaths.pagePath %>')
        }
    ]
}
</route>
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
