module.exports = {
  pages: {
    index: {
      entry: 'src/project/projectA/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  outputDir:'dist/projectA/',
  devServer: {
    port: 8085,
    open:false,
    host: '0.0.0.0',
    https: false,
    disableHostCheck: true,
    proxy: {
      '/A_api': {
        target: '接口地址',
        changeOrigin: true
      }
    }
  }
}