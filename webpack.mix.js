let mix = require("laravel-mix");
const path = require("path");

mix
  .js("src/app.js", "build")
  .webpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  })
  .vue({
    version: 3
  })
  .sourceMaps();