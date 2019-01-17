import { isStandardBrowserEnv, isString } from './utils'

const isURLSameOrigin = (requestURL: any) => {
  if (!isStandardBrowserEnv()) {
    return
  }
  const msie = /(msie|trident)/i.test(navigator.userAgent)
  const urlParsingNode = document.createElement('a')
  const resolveURL = (url: string) => {
    let href = url
    if (msie) {
      urlParsingNode.setAttribute('href', href)
      href = urlParsingNode.href
    }
    urlParsingNode.setAttribute('href', href)
    const {
      protocol = '',
      search = '',
      hash = '',
      host,
      hostname,
      port,
      pathname
    } = urlParsingNode
    return {
      host,
      hostname,
      port,
      href,
      protocol: protocol.replace(/:$/, ''),
      search: search.replace(/^\?/, ''),
      hash: hash.replace(/^#/, ''),
      pathname: pathname.charAt(0) === '/' ? pathname : '/' + pathname
    }
  }
  const originURL = resolveURL(window.location.href)
  const parsed = isString(requestURL) ? resolveURL(requestURL) : requestURL
  return (
    parsed.protocol === originURL.protocol && parsed.host === originURL.host
  )
}

export default isURLSameOrigin