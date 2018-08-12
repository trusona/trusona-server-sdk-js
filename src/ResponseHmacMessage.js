const crypto = require('crypto')

class ResponseHmacMessage {
    constructor(response) {
      this.response = response
    }

    getHmacMessage() {
      console.log(this.response.request.method)
      return {
        bodyDigest: crypto.createHash('md5').update(this.response.body).digest('hex'),
        requestUri: this.getRequestUri(this.response.request.method),
        contentType: this.getContentType(this.response.request.method),
        date: this.response.headers['x-date'],
        method: this.response.request.method
      };
    }

    getRequestUri(method){
      if(method === 'GET'){
        console.log(this.response.request.uri.pathname.query)
        return this.response.request.query;
      }else{
        return this.response.request.uri.pathname
      }
    }

    getContentType(method){
      if(method === 'GET'){
        return ''
      }else{
        return this.response.headers['content-type'];
      }
    }

  }
  module.exports = ResponseHmacMessage