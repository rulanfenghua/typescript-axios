export interface AxiosRequestConfig {
  url?: string
  method?: string
  baseURL?: string
  xsrfCookieName?: string
  xsrfHeaderName?: string
  headers?: any
  params?: any
  data?: any
  timeout?: number
  withCredentials?: boolean
  responseType?: XMLHttpRequestResponseType
  paramSerializer?: (params: any) => string
  onUploadProgress?: (progressEvent: any) => void
  onDownloadProgress?: (progressEvent: any) => void
  validitystate?: (status: number) => boolean
  adapter?: AxiosAdapter
  auth?: any
  transfromRequest?: AxiosTransformer | AxiosTransformer[]
  transfromResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
}

export interface AxiosAdapter {

}

export interface AxiosTransformer {

}

export interface Interceptor {

}

export interface CancelToken {
  
}