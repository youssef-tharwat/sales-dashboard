// vue.config.js
module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    proxy: {
      "/local-api": {
        target: "https://lrcm-api.chimaera.dev",
        pathRewrite: {
          "^/local-api": ""
        },
        changeOrigin: true,
        secure: false,
        ws: true
      },
      "/test-api": {
        target: "https://lrcm-api.chimaera.dev",
        pathRewrite: {
          "^/test-api": ""
        },
        changeOrigin: true,
        ws: true,
        logLevel: "debug"
      },
      "/training-api": {
        target: "https://lrcm-api.stg.chimaera.dev",
        pathRewrite: {
          "^/training-api": ""
        },
        changeOrigin: true,
        ws: true,
        logLevel: "debug"
      },
      "/api": {
        target: "https://lrcm-api-v1.chimaera.my",
        pathRewrite: {
          "^/api": ""
        },
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
};
