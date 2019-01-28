import { AxiosError, AxiosRequestConfig, AxiosResponse } from '../type'

const enhanceError = (
  error: any,
  config: AxiosRequestConfig,
  code: string,
  request?: any,
  response?: AxiosResponse
): AxiosError => {
  if (code) {
    error.code = code
  }

  error.config = config
  error.request = request
  error.response = response
  error.isAxiosError = true
  error.toJSON = function() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      stack: this.stack,
      config: this.config,
      code: this.code
    }
  }

  return error
}

export default enhanceError