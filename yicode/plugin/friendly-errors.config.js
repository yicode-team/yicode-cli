const exportJSON = {
    compilationSuccessInfo: {
        messages: ['---------------------------------------'],
        notes: []
    },
    // onErrors: function (severity, errors) {
    //     // You can listen to errors transformed and prioritized by the plugin
    //     // severity can be 'error' or 'warn'
    // },
    // should the console be cleared between each compilation?
    // default is true
    clearConsole: true,

    // INFO:    all logs
    // WARNING: warnings and errors
    // ERROR:   only errors
    // SILENT:  no log
    logLevel: 'INFO',

    // base: default
    // consola: consola adapter
    // can also be npm package name or reporter object
    // reporter: 'consola',

    // add formatters and transformers (see below)
    additionalFormatters: [],
    additionalTransformers: []
};

export default exportJSON;
