const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const isProd = process.env.NODE_ENV === "product";
module.exports = {
  configureWebpack: {
    // webpack config
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          project: JSON.stringify(process.env.project),
          baseURL: isProd
            ? "htts://生产接口路径"
            : `https:非生产-${process.env.branch}`,
          BASE_URL: `/${process.env.project}/`
        }
      })
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: !isProd ? false : true, //注释console
              drop_debugger: !isProd ? false : true //注释debugger
            }
          }
        })
      ]
    },
    externals: isProd
      ? {
          // 线上环境配置第三方库cdn地址
        }
      : {}
  },
  pages: {
    pim: {
      entry: "src/pages/pim/main.js",
      template: "public/index.html",
      filename: "pim.html",
      chunks: ["chunk-vendors", "chunk-common", "pim"]
    },
    order: {
      entry: "src/pages/order/main.js",
      template: "public/index.html",
      filename: "order.html",
      chunks: ["chunk-vendors", "chunk-common", "order"]
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: "src/pages/error/main.js"
  },
  productionSourceMap: false, // 生产环境禁用sourceMap
  lintOnSave: true,
  publicPath: `/`,
  outputDir: `dist/`,
  devServer: {
    host: "0.0.0.0",
    hotOnly: true,
    open: true,
    port: 8080,
    proxy: {
      "/local": {
        changeOrigin: true,
        pathRewrite: {
          "^/local": ""
        },
        cookiePathRewrite: {
          "/unchanged.path/": "/unchanged.path/",
          "/old.path/": "/new.path/",
          "*": ""
        },
        cookieDomainRewrite: {
          "unchanged.domain": "unchanged.domain",
          "old.domain": "new.domain",
          "*": ""
        }
      }
    }
  }
};
