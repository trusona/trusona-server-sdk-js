const HmacSignatureGenerator = require('./HmacSignatureGenerator');
const RequestHmacMessage = require('./RequestHmacMessage')
const ResponseHmacMessage = require('./ResponseHmacMessage');
const DateUtils = require('./DateUtils');

class RequestHelper {

    constructor(token, secret) {
        this.token = token
        this.secret = secret
    }

    getSignedRequest(options) {
        options.headers = this.getHeaders();
        options.json = true

        let originalTransform = options.transform;

        const signatureGenerator = new HmacSignatureGenerator()

        if(originalTransform == null){
          originalTransform = (body, response, resolveWithFullResponse)=>{
            return body;
          }
        }
        options.transform = (body, response, resolveWithFullResponse) => {
          const responseHmacMessage = new ResponseHmacMessage(response);
          const signature = signatureGenerator.getSignature(responseHmacMessage, this.secret)

          if(response.headers['x-signature'] === signature){
            return originalTransform(body, response, resolveWithFullResponse);
          }else{
            throw new Error('The response signature failed validation');
          }
        }
       
        const requestHmacMessage = new RequestHmacMessage(options)
        const signature = signatureGenerator.getSignature(requestHmacMessage, this.secret)
    
        options.headers['Authorization'] = `TRUSONA ${this.token}:${signature}`
        return options
      }

    getRequest(options){
        options.headers = this.getHeaders();
        options.json = true
        return options
    }

    getHeaders(){
        const header = {
            'Content-Type': 'application/json',
            'User-Agent': 'TrusonaServerSdk/1.0',
            'Date' : new DateUtils().getDate()
        }
        return header;
    }
}

module.exports = RequestHelper