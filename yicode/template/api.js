module.exports = `
import request from '<%= aliasNames.src %>/request/api.js';
export default {
    // 添加
    insert(params) {
        return request({
            method: 'post',
            url: '/insert',
            data: params
        });
    },
    // 删除
    delete(params) {
        return request({
            method: 'post',
            url: '/delete',
            data: params
        });
    },
    // 更新
    update(params) {
        return request({
            method: 'post',
            url: '/update',
            data: params
        });
    },
    // 查询
    select(params) {
        return request({
            method: 'get',
            url: '/select',
            params: params
        });
    }
};
`;
