const path = require('path');
const conf = require('./config/projectsConfig');//引入多个项目的配置
const projectName = require('./config/project')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// import VConsole from 'vconsole';
// const VConsole = require('vconsole')
console.log('process.env.VUE_APP_BASEURL', process.env.VUE_APP_BASEURL)
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  pages: conf.pages,//使用不同的模板
  publicPath: './',
  outputDir: conf.outputDir,//输出到不同的文件夹下
  devServer: conf.devServer,//代理服务器的配置不同,也主要是代理地址不同
  chainWebpack: conf.chainWebpack,
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerPort: process.env.VUE_CLI_MODERN_BUILD ,// Prevents build errors when running --modern
        openAnalyzer: false,
        analyzerMode: "server",
        analyzerHost: "127.0.0.1",
        analyzerPort: '9999', // 运行后的端口号
        reportFilename: "report.html",
        defaultSizes: "parsed",
        generateStatsFile: false,
        statsFilename: "stats.json",
        statsOptions: null,
      }),
    ]
  }
}