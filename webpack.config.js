/**
 *   URL:
 *   说明:
 *   负责人: Woo Xin Chen
 *   日期:  2022 07 13.
 */
module.exports = {
    entry: __dirname + "/src/index.ts",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    devtool: "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    }
}