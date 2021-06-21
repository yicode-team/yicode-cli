module.exports = `
export default {
    path: '<%= lowerCaseNameRoutePath %>',
    component: () => import('<%= aliasNames.src %>/layout/default/index.vue'),
    children: [
        {
            path: '/',
            component: () => import('<%= aliasNames.src %>/pages/<%= lowerCaseNameRouteBackslash %>/index.vue')
        }
    ]
};
`;
