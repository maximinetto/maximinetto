const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const CriticalCssPlugin = require("critical-css-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const isDevelopment = argv.mode === "development";

  const plugins = [
    new HtmlWebpackPlugin({ template: "./src/index.html", cache: false }),
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
    use: [
      {
        loader: "css-loader",
        options: {
          url: true,
          importLoaders: 1,
        },
      },
      "postcss-loader",
    ],
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
      assetModuleFilename: isDevelopment ? "[name][ext]" : "assets/[hash][ext]",
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
          test: /\.html$/i,
          use: ["html-loader"],
        },
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: "asset/resource",
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
        minimizer: [
          new CssMinimizerPlugin(),
          new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                  ["gifsicle", { interlaced: true }],
                  ["jpegtran", { progressive: true }],
                  ["optipng", { optimizationLevel: 5 }],
                  // Svgo configuration here https://github.com/svg/svgo#configuration
                  [
                    "svgo",
                    {
                      plugins: extendDefaultPlugins([
                        {
                          name: "removeViewBox",
                          active: false,
                        },
                        {
                          name: "addAttributesToSVGElement",
                          params: {
                            attributes: [
                              { xmlns: "http://www.w3.org/2000/svg" },
                            ],
                          },
                        },
                      ]),
                    },
                  ],
                ],
              },
            },
          }),
        ],
      },
    }),
  };
};
