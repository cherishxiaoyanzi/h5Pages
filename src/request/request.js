/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import { Toast } from 'vant'
const projectName = require('../../config/project')
let baseURL = `${projectName.api}`
console.log('baseURL', baseURL)
const ShowToast = msg => {
  Toast({
    message: msg,
    duration: 3000,
    forbidClick: true
  })
}
// axios实例
const server = axios.create({
  baseURL: baseURL,
  transformRequest: [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }],
  timeout: 7000,
  headers: { 'Content-Type':  'application/x-www-form-urlencoded' }
})
// 添加请求拦截器
server.interceptors.request.use(function (config) {
  Toast.loading({
    // message: '加载中...',
    forbidClick: true,
    duration: 0,
    loadingType: 'spinner'
  })
  return config
}, function (error) {
  // 对请求错误做些什么
  ShowToast('请求失败')
  return Promise.reject(error)
})
// 添加响应拦截器
server.interceptors.response.use(response => {
  Toast.clear()
  if (response.data.state <= 0) {
    ShowToast(response.data.errMsg)
  }
  return response
}, error => {
  Toast.clear()
  ShowToast('网络中断..')
  return Promise.reject(error)
})
 /**
 * @param url 请求地址
 * @param params 请求参数
 */
async function get(url, params, dataType= '') {
  const res = await server({
      url: url,
      method: 'GET',
      params: params,
      headers: dataType ? { 'Content-Type': dataType} : { 'Content-Type':  'application/x-www-form-urlencoded' }
  })
  return res.data
}
/**
 * 
 * @param url 请求地址
 * @param data 请求参数
 */
async function post(url, data, dataType= '') {
  console.log(2)
  const res = await server({
      url: url,
      method: 'POST',
      data: data,
      headers: dataType ? { 'Content-Type': dataType} : { 'Content-Type':  'application/x-www-form-urlencoded' }
  })
  return res.data
}
export { get, post }