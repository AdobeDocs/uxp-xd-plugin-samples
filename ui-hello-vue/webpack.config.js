const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    libraryTarget: "commonjs2",
  },
  devtool: "none", // prevent webpack from using eval() on my module
  externals: {
    uxp: "commonjs2 uxp",
    scenegraph: "scenegraph",
    os: "commonjs2 os",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: "file-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin(["plugin"], {
      copyUnmodified: true,
    }),
  ],
};
