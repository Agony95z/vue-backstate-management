import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useUsersStore } from '@/stores/users';
import { ElMessage } from 'element-plus';
let userStore: any = null;
const instance = axios.create({
  baseURL: 'http://api.h5ke.top/',
  timeout: 5000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  if (userStore === null) {
    userStore = useUsersStore();
  }
  if (config.headers) {
    config.headers.authorization = userStore.token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  if (response.data.errmsg === 'token error') {
    ElMessage.error('token error');
    if (userStore === null) {
      userStore = useUsersStore();
    }
    userStore.clearToken();
    setTimeout(() => {
      window.location.replace('/login');
    }, 1000);
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

interface Data {
  [index: string]: any
}
interface Http {
  get: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  post: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  put: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  patch: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  delete: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
}
const http: Http = {
  get(url, data, config){
    return instance.get(url, {
      params: data,
      ...config
    })
  },
  post(url, data, config){
    return instance.post(url, data, config)
  },
  put(url, data, config){
    return instance.put(url, data, config)
  },
  patch(url, data, config){
    return instance.patch(url, data, config)
  },
  delete(url, data, config){
    return instance.delete(url, {
      data,
      ...config
    })
  }
}

export default http;