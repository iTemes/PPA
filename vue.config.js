const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/static/AppTesting/",
  outputDir: path.resolve(__dirname, "../centrsvet/static/AppTesting/"),
});
