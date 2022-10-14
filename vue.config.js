
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
  