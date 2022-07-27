import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from './auth'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime()
    console.log(time)
    if (time > 7200000) {
      Message.error('登录超时、请重新登录')
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const { data, success, message } = response.data
  if (success) {
    // Message.success(message)
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 对响应错误做点什么
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  return Promise.reject(error)
})
export default request
