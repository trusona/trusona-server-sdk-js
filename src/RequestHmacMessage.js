const url = require('url');
const crypto = require('crypto')

class RequestHmacMessage {
    constructor(options) {
      this.options = options
    }

    getHmacMessage() {
      const requestUri = url.parse(this.options.url);

      return {
        bodyDigest: crypto.createHash('md5').update(this.options.body).digest('hex'),
      

        requestUri: this.getRequestUri(this.options.method, requestUri),
        contentType: this.getContentType(this.options.method),
        date: this.options.headers['Date'],
        method: this.options.method
      }
    }

    getRequestUri(method, requestUri){
      if(method === 'GET'){
        console.log(requestUri.pathname.query)
        return requestUri.query;
      }else{
        return requestUri.pathname
      }
    }

    getContentType(method){
      if(method === 'GET'){
        return ''
      }else{
        return this.options.headers['content-type'];
      }
    }
    
  }
  module.exports = RequestHmacMessage