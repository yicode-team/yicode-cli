export const pageRoute = `
export default {
    path: '/<%= filePaths.pageRoute %>',
    component: () => import('@/layout/default/index.vue'),
    children: [
        {
            path: '/',
            component: () => import('@/pages/<%= filePaths.pagePath %>')
        }
    ]
};
`;
