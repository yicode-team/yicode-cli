// TODO: 待处理
const schemaConfig = {
    // yicode配置参数验证
    yicodeConfig: {
        type: 'object',
        properties: {
            option: {
                type: 'boolean'
            }
        },
        additionalProperties: false
    }
};

export { schemaConfig };
