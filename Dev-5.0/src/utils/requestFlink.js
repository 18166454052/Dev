import axios from 'axios'
import {
  Message
} from 'element-ui'
import {
  getSessionId
} from '@/utils/auth'
import store from '@/store'
import router from '../router'
var CancelToken = axios.CancelToken;
var source = CancelToken.source();

// create an axios instance
const service = axios.create({
  baseURL: process.env.FLINK_API, // api的base_url
  timeout: 3600000, // request timeout
  widthCredentials: false  // 设置 withCredentials 使请求带上 `cookies`
})

// request interceptor
service.interceptors.request.use(config => {
  // config.headers['accessToken'] = getSessionId()
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    //
    let RES = response.data;
  
    if (RES.code == 401) {
      console.log('********************401*******************************')
      router.push('/login')
      location.reload()
      return Promise.reject(RES)
    } else {
      return RES
    }

  },
  error => {
   
    return Promise.reject(error)
  })

export default service
