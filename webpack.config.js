const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/js/index.js",
  plugins: [
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(
        process.env.GITHUB_REF_NAME || "dev"
      )
    })
  ],
  
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  }, 
  performance: {
    hints: false,
  },
  optimization: {
    minimize: true
  },
};
