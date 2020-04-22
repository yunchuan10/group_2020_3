const path = require('path')
const webpack = require('webpack')

module.exports = {

    publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/', // 部署应用包时的基本URL(这里可以看一下官方说明)
    outputDir: 'dist', // 打包时生成的生产环境构建稳健的目录
    assetsDir: 'static', // 放置生成的静态资源的目录
    filenameHashing: true,
    lintOnSave: true, // eslint-loader会将lint错误输出为编译警告
    productionSourceMap: false, // 如果你不需要生产环境的source map，可以将其设置为false，以加速生产环境的构建

    chainWebpack: config => {
      config.module
        .rule('images')
          .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 1024*10 }))
    },


    // dev环境
    devServer: {
        proxy: {
            '/api': {
            target: '<url>',
            ws: true,
            changeOrigin: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    }



}