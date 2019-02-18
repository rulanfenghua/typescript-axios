import Cancel from './Cancel'
import { Canceler } from '../type'

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(excutor: (cancel: Canceler) => void) {
    if (!excutor) {
      throw new TypeError('executor must be a function.')
    }
    const token = this
    let resolvePromise: any

    this.promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    excutor(function cancel(message) {
      if (token.reason) {
        return
      }
      message && (token.reason = new Cancel(message))
      resolvePromise(token.reason)
    })
  }
}