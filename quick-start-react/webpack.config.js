const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/main.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    devtool: 'source-map',
    externals: {
        uxp: 'commonjs2 uxp',
        os: 'commonjs2 os',
        scenegraph: 'scenegraph'
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: [
                        "transform-react-jsx"
                    ]
                }
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new CopyPlugin(['plugin'], {
            copyUnmodified: true
        })
    ]
};