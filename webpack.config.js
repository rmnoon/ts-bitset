const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const _ = require('lodash');
const path = require('path');
const TSLintPlugin = require('tslint-webpack-plugin');

const IS_PROD_BUILD = process.env.BUILD === 'prod';
const PROJECTS = (process.env.PROJECTS || null).split(',');
const DEPLOYMENT = process.env.DEPLOYMENT || null;

const includeDirs = ['src'].map(x => path.resolve(__dirname, x));

const moduleConfig = (tscOptions = {}) => ({
    rules: [
        {
            test: /\.(ts)$/,
            include: includeDirs,
            use: [
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        ...tscOptions // according to the atl docs this should be under a compilerOptions prop but whatever
                    }
                }
            ]
        }
    ]
});

const tsLintPlugin = new TSLintPlugin({
    files: includeDirs.map(d => `${d}/**/*.{ts,tsx}`),
    config: 'tslint.json',
    project: 'tsconfig.json',
    waitForLinting: true,
    warningsAsError: true
})

const resolveConfig = {
    symlinks: false,
    extensions: ['.js', '.json', '.ts', '.tsx']
};

const backendBuild = (name, entryFile, outputFile = 'server.js') => {
    return {
        name: name,
        target: 'node',
        entry: entryFile,
        output: {
            path: __dirname + '/dist',
            filename: outputFile,
            pathinfo: true
        },
        module: moduleConfig({ target: 'ES2017', module: 'ES6' }),
        mode: IS_PROD_BUILD ? 'production' : 'development',
        devtool: 'source-map',
        optimization: {
            minimize: false, // turns off use of UglifyJsPlugin which does various kinds of mangling of names
            concatenateModules: false, // prevents module concatenation which causes names to be concatenated with their module names
            namedModules: true, // use readable module identifiers for better debugging
            namedChunks: true, // use readable chunk identifiers for better debugging
            flagIncludedChunks: false, // disable determining if chunks are part of a larger chunk
            occurrenceOrder: false, // disbale optimizing order of modules in the bundle
            sideEffects: false, // ignore sideEffects flag in package.json, hence no tree shaking
            usedExports: false // disable determining which exports are used
        },
        performance: {
            hints: false
        },
        externals: [nodeExternals()],
        resolve: resolveConfig,
        plugins: [tsLintPlugin]
    };
}

const availableProjects = {

    test: backendBuild('test', './src/all.test.main.ts', 'tests.js'),

};

module.exports = PROJECTS.map(p => availableProjects[p]);
