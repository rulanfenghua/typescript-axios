import InterceptorManager from './InterceptorManager'
import dispatchRequest from './dispatchRequest'
import { AxiosRequestConfig, Interceptor } from '../type'

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: InterceptorManager;
    response: InterceptorManager;
  }
  constructor (instanceConfig: AxiosRequestConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request (config: AxiosRequestConfig = {}) {
    const {method} = config
    const newConfig: AxiosRequestConfig = {
      ...this.defaults,
      ...config,
      method: method? method.toLowerCase() : 'get'
    }
  }
}