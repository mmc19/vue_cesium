const CopyWebPackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const { defineConfig } = require('@vue/cli-service')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  publicPath: '/cesiumLesson',
  outputDir: 'dist',
  lintOnSave: false,
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8088,
    https: false,
    proxy: {
      '/api':{
        tartget: 'http://localhost:8091', // 实际请求地址,
        changeOrigin: true,
        rewrite: (path) =>path.replace(/^\/api/, 'api')
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.cjs.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebPackPlugin({ patterns: [{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }] }),
      new CopyWebPackPlugin({ patterns: [{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }] }),
      new CopyWebPackPlugin({ patterns: [{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }] }),
      new CopyWebPackPlugin({ patterns: [{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }] }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],

  }
})