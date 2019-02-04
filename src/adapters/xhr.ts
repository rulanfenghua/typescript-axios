import settle from '../core/settle'
import createError from '../core/createError'
import { isFormData, isStandardBrowserEnv } from '../helpers/utils'
import { AxiosPromise, AxiosRequestConfig } from '../type'
import {
  buildURL,
  cookies,
  isURLSameOrigin,
  parseHeaders
} from '../helpers/index'

const xhrAdapter = (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    const {
      headers: requestHeaders,
      data: requestData,
      method = 'get',
      url = '',
      params,
      paramsSerializer,
      auth,
      timeout,
      withCredentials,
      responseType,
      onDownloadProgress,
      onUploadProgress,
      cancelToken,
      xsrfHeaderName,
      xsrfCookieName
    } = config
    let request: XMLHttpRequest | null = new XMLHttpRequest()

    const setHeaders = () => {
      if (!request) {
        return
      }
      if (isFormData(requestData)) {
        delete requestHeaders['Content-Type']
      }
      if (auth) {
        const { username = '', password = '' } = auth
        requestHeaders.Authorization =
          'Basic' + btoa(username + ':' + password)
      }
      if (isStandardBrowserEnv()) {
        const xsrfValue =
          (withCredentials || isURLSameOrigin(url)) && xsrfCookieName
            ? cookies.read(xsrfCookieName)
            : undefined
        if (xsrfValue && xsrfHeaderName) {
          requestHeaders[xsrfHeaderName] = xsrfValue
        }
      }
      if ('setRequestHeader' in requestHeaders) {
        for (const key in requestHeaders) {
          if (requestHeaders.hasOwnProperty(key)) {
            const val = requestHeaders[key]
            if (
              typeof requestData === 'undefined' &&
                key.toLowerCase() === 'contnet-type'
            ) {
              delete requestHeaders[key]
            } else {
              request.setRequestHeader(key, val)
            }
          }
        }
      }
    }

    const setXHR = () => {
      if (!request) {
        return
      }
      timeout && (request.timeout = timeout)
      request.onreadystatechange = () => {
        if (!request || request.readyState !== 4) {
          return
        }
        const {
          status,
          responseURL,
          responseText,
          response,
          statusText
        } = request
        if (
          status === 0 &&
          !(responseURL && responseURL.indexOf('file:') === 0)
        ) {
          return
        }
        const responseHeaders =
          'getAllResponseHeaders' in request
            ? parseHeaders(request.getAllResponseHeaders)
            : null
        const responseData =
          !responseType || responseType === 'text' ? responseText : response
        const newResponse = {
          data: responseData,
          status: status,
          statusText: statusText,
          headers: responseHeaders,
          config: config,
          request: request
        }

        settle(resolve, reject, newResponse)
        request = null
      }

      request.onabort = () => {
        if (!request) {
          return
        }
        reject(createError('Request aborted', config, 'ECONNABORTED', request))
        request = null
      }
      request.onerror = () => {
        reject(createError('Network Error', config, '', request))
        request = null
      }
      request.ontimeout = () => {
        reject(
          createError(
            `timeout of ${timeout} ms exceeded`,
            config,
            'ECONNABORTED',
            request
          )
        )
        request = null
      }

      if (cancelToken) {
        cancelToken.promise.then((cancel) => {
          if (!request) {
            return
          }
          request.abort()
          reject(cancel)
          request = null
        }).catch((err) => {
          console.error(err)
        })
      }
      if (withCredentials) {
        request.withCredentials = true
      }
      if (responseType) {
        try {
          request.responseType = responseType
        } catch (e) {
          if (responseType !== 'json') {
            throw e
          }
        }
      }
      if (typeof onDownloadProgress === 'function') {
        request.addEventListener('progress', onDownloadProgress)
      }
      if (typeof onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', onUploadProgress)
      }
    }

    const openXHR = () => {
      if (!request) {
        return
      }
      request.open(
        method.toUpperCase(),
        buildURL(url, params, paramsSerializer),
        true
      )
    }

    const sendXHR = () => {
      if (!request) {
        return
      }
      request.send(requestData || null)
    }

    setHeaders()
    openXHR()
    setXHR()
    sendXHR()
  })
}

export default xhrAdapter
