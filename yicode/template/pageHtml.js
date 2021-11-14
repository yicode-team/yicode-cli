export default `<template>
    <<%= aliasNames.tag %> class="page-<%= names.lowerCaseName %>">
        <%= names.kebabCaseName %>
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
        // 接口 - 增加
        api_insert() {
            return new Promise((resolve, reject) => {
                this.$Apis.<%= startCaseNameRouteDot %>
                    .insert()
                    .then((res) => {
                        console.log('api_insert(res): 接口描述');
                        console.dir(res);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('api_insert(err): 接口描述');
                        console.dir(err);
                        reject(err);
                    });
            });
        },
        // 接口 - 删除
        api_delete() {
            return new Promise((resolve, reject) => {
                this.$Apis.<%= startCaseNameRouteDot %>
                    .delete()
                    .then((res) => {
                        console.log('api_delete(res): 接口描述');
                        console.dir(res);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('api_delete(err): 接口描述');
                        console.dir(err);
                        reject(err);
                    });
            });
        },
        // 接口 - 修改
        api_update() {
            return new Promise((resolve, reject) => {
                this.$Apis.<%= startCaseNameRouteDot %>
                    .update()
                    .then((res) => {
                        console.log('api_update(res): 接口描述');
                        console.dir(res);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('api_update(err): 接口描述');
                        console.dir(err);
                        reject(err);
                    });
            });
        },
        // 接口 - 查询
        api_select() {
            return new Promise((resolve, reject) => {
                this.$Apis.<%= startCaseNameRouteDot %>
                    .select()
                    .then((res) => {
                        console.log('api_select(res): 接口描述');
                        console.dir(res);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('api_select(err): 接口描述');
                        console.dir(err)
                        reject(err);
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.page-<%= names.lowerCaseName %> {
}
</style>
`;
