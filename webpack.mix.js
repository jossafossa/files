let mix = require("laravel-mix");
const path = require("path");

mix
  .disableNotifications()
  .setPublicPath(`build/`)
  .js("src/app.js", "build")
  .webpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  })
  .vue({
    version: 3,
  })
  .browserSync({
    proxy: "http://www.files.test/",
    files: ["build/**/*"],
    open: "external",
    host: "www.files.test",
  })
  // disable cache
  .version();
