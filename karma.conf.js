const tsconfig = require('./tsconfig.json');

tsconfig.compilerOptions.noEmit = false;

module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai', 'sinon', 'karma-typescript'],
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            { pattern: 'src/**/*.ts' },
            { pattern: 'test/unit/**/*.spec.ts' },
        ],
        preprocessors: {
            '**/*.ts': ['karma-typescript'], // *.tsx for React Jsx
        },
        reporters: ['progress', 'karma-typescript'],
        karmaTypescriptConfig: {
            bundlerOptions: {
                transforms: [
                    require("karma-typescript-es6-transform")()
                ]
            },
            compilerOptions: tsconfig.compilerOptions,
            reports: {
                'html': '.coverage',
                'text-summary': '',
                'text-lcov': ''
            }
        },
        browsers: ['ChromeHeadless'],
    });
};