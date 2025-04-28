const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/inter-knot/",
  css: {
    loaderOptions: {
      less: {
        additionalData: `@import "@/assets/global.less";`
      }
    }
  }
})


