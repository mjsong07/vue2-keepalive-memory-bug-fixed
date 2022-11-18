const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false
// })



// chainWebpack: config => { 
//   config.externals({
//     vue: "Vue", 
//   }); 
// },
// configureWebpack: {
//   devtool: "eval-source-map"
// },



module.exports = {
  chainWebpack: config => { 
    config.externals({
      vue: "Vue", 
    }); 
  },
  configureWebpack: {
    devtool: "eval-source-map"
  },
  lintOnSave: false
};
