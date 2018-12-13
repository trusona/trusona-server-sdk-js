const crypto = require('crypto')
const url = require('url')
const qs = require('qs')

class RequestHmacMessage {

  constructor(options) {
    this.options = options
  }

  getHmacMessage() {
    const body = this.options.body || ''
    return {
      bodyDigest: crypto.createHash('md5').update(body).digest('hex'),
      requestUri: this.getRequestUri(),
      contentType: this.getContentType(),
      date: this.options.headers['date'],
      method: this.options.method
    }
  }

  getRequestUri() {
    if (this.options.qs) {
      return `${this.options.url}?${qs.stringify(this.options.qs)}`
    } else {
      return this.options.url
    }
  }

  getContentType(){
    return this.options.headers['content-type'] || ''
  }
}
module.exports = RequestHmacMessage