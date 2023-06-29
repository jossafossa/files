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
  .vue({ version: 3 })
  // browserSync files.jossafossa.test on port 3000 and open the proxy url in the browser. Auto reload on changes.
  .browserSync({
    proxy: "files.jossafossa.test",
    port: 3000,
    host: "files.jossafossa.test",
    open: "external",
    files: "build/app.js",
    injectChanges: true,
  })
  .sourceMaps();
