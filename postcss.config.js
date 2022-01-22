const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("postcss-preset-env"),
    require("autoprefixer"),
    require("precss"),
    require("postcss-nested"),
    purgecss({
      content: ["./**/*.html"],
    }),
  ],
};
