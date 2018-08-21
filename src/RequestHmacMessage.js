const url = require('url');
const crypto = require('crypto')
const qs = require('qs')

class RequestHmacMessage {
    constructor(options) {
      this.options = options
    }

    getHmacMessage() {
      const requestUri = url.parse(this.options.url);
      const body = this.options.body || ''
      return {
        bodyDigest: crypto.createHash('md5').update(body).digest('hex'),
        requestUri: this.getRequestUri(this.options, requestUri),
        contentType: this.getContentType(),
        date: this.options.headers['date'],
        method: this.options.method
      }
    }

    getRequestUri(options, requestUri){
      if (options.qs) {
        return `${requestUri.pathname}?${qs.stringify(options.qs)}`
      }else{
        return requestUri.pathname;
      }
    }

    getContentType(){
      return this.options.headers['content-type'] || ''
    }

  }
  module.exports = RequestHmacMessage