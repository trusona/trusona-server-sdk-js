const url = require('url');
const crypto = require('crypto')
const qs = require('qs')

class RequestHmacMessage {
    constructor(options) {
      this.options = options
    }

    getHmacMessage() {
      const requestUri = url.parse(this.options.url);

      return {
        bodyDigest: crypto.createHash('md5').update(this.options.body).digest('hex'),
      

        requestUri: this.getRequestUri(this.options, requestUri),
        contentType: this.getContentType(),
        date: this.options.headers['Date'],
        method: this.options.method
      }
    }

    getRequestUri(options, requestUri){
      if (options.qs) {
        return `${requestUri.pathname}?${qs.parse(options.qs)}`
      }else{
        return requestUri.pathname;
      }
    }

    getContentType(){
      return this.options.headers['content-type'] || ''
    }
    
  }
  module.exports = RequestHmacMessage