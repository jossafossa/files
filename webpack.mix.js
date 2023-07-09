let mix = require("laravel-mix");
const path = require("path");

mix
  .disableNotifications()
  .setPublicPath(`build`)
  // src/app.js, build/app.js
  // src/assets/js/worker.js build/worker.js
  .js(`src/app.js`, `build`)
  .js(`src/assets/js/worker.js`, `build`)
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
    // proxy: "http://www.files.test/",
    // port: 8080,
    // files: ["build/**/*"],
    // open: "external",
    // host: "www.files.test",
  })
  // disable cache
  .version()
  .sourceMaps();
