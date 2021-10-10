const tapable = require('tapable');
const promptConfig = {};
const promptTapable = new tapable.SyncHook();
promptTapable.tap('isCreateProject', () => {});
