const url = require('url');
const crypto = require('crypto')

class RequestHmacMessage {
    constructor(options) {
      this.options = options
    }
  
    getHmacMessage() {
      const body = JSON.stringify(this.options.body);
      const requestUri = url.parse(this.options.url);
  
      return {
        bodyDigest: crypto.createHash('md5').update(body).digest('hex'),
        requestUri: requestUri.pathname, // TODO: include query string for GET requests
        contentType: this.options.headers['Content-Type'],
        date: this.options.headers['Date'],
        method: this.options.method
      }
    }
  }
  module.exports = RequestHmacMessage