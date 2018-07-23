const request = require('request-promise');
const dateFormat = require('dateformat');
const HmacSignatureGenerator = require('./hmacSignatureGenerator');
const crypto = require('crypto')

class RequestHmacMessage {
  constructor(options) {
    this.options = options
  }

  getHmacMessage() {
    const body = JSON.stringify(this.options.body);
    return {
      bodyDigest: crypto.createHash('md5').update(body).digest('hex'),
      requestUri: '/api/v2/user_devices', // TODO: parse this from this.options.url
      contentType: this.options.headers['Content-Type'],
      date: this.options.headers['Date'],
      method: this.options.method
    }
  }
}
class ResponseHmacMessage {
  constructor(response){
    this.response = response
  }

  getHmacMessage() {
    const body = JSON.stringify(this.response.body);
    const hmacMessage =  {
      bodyDigest: crypto.createHash('md5').update(body).digest('hex'),
      requestUri: '/api/v2/user_devices', // TODO: parse this from this.options.url
      contentType: this.response.headers['content-type'],
      date: this.response.headers['x-date'],
      method: this.response.request.method
    }
    console.log(hmacMessage);
    return hmacMessage;
  }
}

class Trusona {
  constructor(token, secret) {
    this.token = token
    this.secret = secret
  }

  createUserDevice(userIdentifier, deviceIdentifier) {
    const options = this.getSignedRequest({
      url: 'https://api.staging.trusona.net/api/v2/user_devices',
      method: 'POST',
      json: true,
      transform : (body, response, resolveWithFullResponse) => {
        body.activation_code = body.id;
        return body;
      },
      body: {
        'user_identifier': userIdentifier,
        'device_identifier': deviceIdentifier
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TrusonaServerSdk/1.0',
        'Date' : this.getDate()
      }
    });

   return request.post(options);
  }

  getSignedRequest(options) {
    let originalTransform = options.transform;
    if(originalTransform == null){
      originalTransform = (body, response, resolveWithFullResponse)=>{
        return body;
      }
    }
    options.transform = (body, response, resolveWithFullResponse) => { 
      const responseHmacMessage = new ResponseHmacMessage(response);
      const signature = new HmacSignatureGenerator().getSignature(responseHmacMessage, this.secret)
      if(response.headers['x-signature'] === signature){
        return originalTransform(body, response, resolveWithFullResponse);
      }else{
        throw new Error('The response signature failed validation');
      }
    }
    const signatureGenerator = new HmacSignatureGenerator()
    const hmacMessage = new RequestHmacMessage(options)
    const signature = signatureGenerator.getSignature(hmacMessage, this.secret)

    options.headers['Authorization'] = `TRUSONA ${this.token}:${signature}`
    return options
  }

  getDate() {
    var now = new Date();
    return dateFormat(now, "GMT, dd MMM YYYY  HH:mm:ss Z");
  }
}

module.exports = Trusona