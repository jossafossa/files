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
  // browserSync files.jossafossa.test on port 3000 and open the proxy url in the browser. Auto reload on changes.
  .browserSync({
<<<<<<< HEAD
    // proxy: "files.test",
    port: 3000,
    // host: "files.test",
    // open: "external",
=======
    proxy: "www.files.test",
    port: 3000,
    host: "www.files.test",
    open: "external",
>>>>>>> 58a04c35472d78b361bfa3259f59af0c33611c67
    files: "build/app.js",
    injectChanges: true,
  })
  .sourceMaps();