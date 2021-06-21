// lint-staged.config.js
// const micromatch = require('micromatch');
// const prettier = require('prettier');

// const prettierSupportedExtensions = prettier
//     .getSupportInfo()
//     .languages.map(({ extensions }) => extensions)
//     .flat();
// const addQuotes = (a) => `"${a}"`;

// module.exports = (allStagedFiles) => {
//     const prettierFiles = micromatch(
//         allStagedFiles,
//         prettierSupportedExtensions.map((extension) => `**/*${extension}`)
//     );
//     return [`prettier --write ${prettierFiles.map(addQuotes).join(' ')}`];
// };
module.exports = {
    '*.{js,css,scss,less,ts,jsx,vue,html,json,md,yaml}': 'prettier --write'
};
