const HmacSignatureGenerator = require('./security/HmacSignatureGenerator')
const ResponseHmacMessage = require('./security/ResponseHmacMessage')
const RequestHmacMessage = require('./security/RequestHmacMessage')
const TrusonaError = require('../../resources/error/TrusonaError')
const DateUtils = require('../../resources/util/DateUtils')
const Environment = require('./environment/Environment')

class RequestHelper {

  constructor(token, secret, env) {
      this.token = token
      this.secret = secret
      this.baseUrl = Environment.getEnvironment(env)
  }

  getSignedRequest(options) {
    options.baseUrl = this.baseUrl
    options.headers = this.getHeaders(options)
    options.json = false
    options.body = JSON.stringify(options.body)
      
    let originalTransform = options.transform
    const signatureGenerator = new HmacSignatureGenerator()

    if(originalTransform == null){
      originalTransform = (body, response, resolveWithFullResponse) => {
        return body;
      }
    }

    options.transform = (body, response, resolveWithFullResponse) => {

      if(response.statusCode.toString().startsWith('2')){
        const responseHmacMessage = new ResponseHmacMessage(response);
        const signature = signatureGenerator.getSignature(responseHmacMessage, this.secret)

        if(response.headers['x-signature'] === signature){
          return originalTransform(body ? JSON.parse(body) : body, response, resolveWithFullResponse);
        } else {
          throw new TrusonaError('The response signature failed validation');
        }
      }
    }

    const requestHmacMessage = new RequestHmacMessage(options)
    const signature = signatureGenerator.getSignature(requestHmacMessage, this.secret)

    options.headers['authorization'] = `TRUSONA ${this.token}:${signature}`
    return options
  }

  getRequest(options){
    options.baseUrl = this.baseUrl
    options.headers = this.getHeaders()
    options.json = true
    return options
  }

  getHeaders(options) {
    let headers = {
      'user-agent': 'TrusonaServerSdk/1.0',
      'date' : new DateUtils().getDate()
    }

    if (options.body) {
      headers['content-type'] = 'application/json'
      headers['accept'] = 'application/json'
    }
    return headers
  }
}
module.exports = RequestHelper