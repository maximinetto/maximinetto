const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const CriticalCssPlugin = require("critical-css-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const isDevelopment = argv.mode === "development";

  const plugins = [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new CleanWebpackPlugin(),
    new ESLintWebpackPlugin(),
  ];

  isProduction &&
    plugins.push(
      new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
      new CriticalCssPlugin()
    );

  const cssRule = {
    test: /\.css$/i,
    use: ["css-loader", "postcss-loader"],
  };

  if (isProduction) {
    cssRule.use.unshift(MiniCssExtractPlugin.loader);
  } else {
    cssRule.use.unshift("style-loader");
  }

  return {
    entry: "./src/assets/scripts/index.js",
    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    plugins,
    ...(isDevelopment && {
      devtool: "inline-source-map",
    }),
    ...(isDevelopment && {
      devServer: {
        port: 3000,
        open: true,
        hot: true,
      },
    }),
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.(jpg|jpeg|png|svg)/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: isDevelopment ? "[name].[ext]" : "[contenthash].[ext]",
                outputPath: "static/",
              },
            },
          ],
        },
        cssRule,
      ],
    },
    resolve: {
      extensions: ["*", ".js"],
    },
    ...(isProduction && {
      optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()],
      },
    }),
  };
};
