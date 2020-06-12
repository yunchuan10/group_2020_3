const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
module.exports = {

    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', // 部署应用包时的基本URL(这里可以看一下官方说明)
    outputDir: 'dist', // 打包时生成的生产环境构建稳健的目录
    assetsDir: 'static', // 放置生成的静态资源的目录
    filenameHashing: true,
    lintOnSave: true, // eslint-loader会将lint错误输出为编译警告
    productionSourceMap: false, // 如果你不需要生产环境的source map，可以将其设置为false，以加速生产环境的构建

    chainWebpack: (config)=>{
      console.log(config.resolve.alias.set, 1111111111);
      console.log(resolve('./src'), 22222222);
      console.log(resolve('src'), 33333333);
      //修改文件引入自定义路径
      config.resolve.alias
          .set('@', resolve('./src'))
          .set('style', resolve('./src/assets'))

      // config.resolve.alias
      //   .set('@', resolve('src')) // 比如.set('@@', resolve('src/components'))

      // config.module
      //   .rule('images')
      //     .use('url-loader')
      //       .loader('url-loader')
      //       .tap(options => Object.assign(options, { limit: 1024*10 }))



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