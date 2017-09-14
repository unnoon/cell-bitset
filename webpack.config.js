module.exports = {
    entry: './test/prototypes/index.ts',
    output: {
        filename: 'tmp/bundle.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx', 'json']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    devtool: "source-map"
};