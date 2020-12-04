const path = require('path');
// 解决启动时报错resolve is not defined
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  pages: {
    index: {
      entry: 'src/project/projectB/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  outputDir:'dist/projectB/',
  devServer: {
    port: 8080,
    open: false,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/B_api': {
        target: '接口地址',
        changeOrigin: true,
        pathRewrite: {

        }
      }
    }
  },
  chainWebpack: (config)=> {
     // 压缩代码
     config.optimization.minimize(true)
    config.entry.app = ['babel-polyfill', '../src/projects/projectB/main.js']
    config.resolve.alias
      .set('@', resolve('./src/projects/projectB/'))
      .set('@project', resolve('./src/'))
  }
}