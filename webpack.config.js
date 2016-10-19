var webpack = require('webpack');
var path = require('path');

var tslint = {
    emitErrors: true,
    failOnHint: true
};

var resolve = {
    extensions: ['', '.js', '.ts']
};

function plugins(prod) {
    return prod ? [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: { screw_ie8: true, keep_fnames: true },
            compress: { screw_ie8: true },
            comments: false
        }),
        new webpack.optimize.DedupePlugin()
    ] : [];
}

function config(prod) {
    return {
        // name: 'shinygraph global variable lib',
        entry: './src/BitSet.ts',
        output: {
            path: path.join(__dirname, './dist'),
            filename: prod ? 'bitset.min.js' : 'bitset.js'
        },
        module: {
            preLoaders: [{ test: /\.ts$/, loader: 'tslint' }],
            loaders: [
                { test: /\.ts$/, exclude: /\.spec.ts$/, loaders: ['ts'] }
            ]
        },
        tslint: tslint,
        plugins: plugins(prod),
        resolve: resolve
    }
}

module.exports = [
    config(false),
    config(true)
];
