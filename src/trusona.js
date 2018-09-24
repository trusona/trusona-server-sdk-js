const request = require('request-promise')
const promisePoller = require('promise-poller')
const RequestHelper = require('./RequestHelper')
const ApiCredentials = require('./ApiCredentials')
const WebSdkConfig = require('./WebSdkConfig')
const UAT = "uat";
const PRODUCTION = "production"

class Trusona {

  constructor(token, secret, env) {
    this.apiCredentials = new ApiCredentials(token, secret)
    this.requestHelper = new RequestHelper(token, secret, env)
  }

  static get UAT() {
    return UAT;
  }

  static get PRODUCTION() {
    return PRODUCTION;
  }

  createUserDevice(userIdentifier, deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: '/api/v2/user_devices',
      method: 'POST',
      transform : (body, response, resolveWithFullResponse) => {
        body.activation_code = body.id;
        return body;
      },
      body: {
        'user_identifier': userIdentifier,
        'device_identifier': deviceIdentifier
      }
    });
   return request(options);
  }

  activateUserDevice(activationCode) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/user_devices/${activationCode}`,
      method: 'PATCH',
      body: { active: true }
    });

   return request(options);
  }

  createTrusonafication(trusonafication) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/trusonafications`,
      method: 'POST',
      body : trusonafication
    });

    return request(options);
  }

  getDevice(deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/devices/${deviceIdentifier}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.is_active;
        return body;
      }
    });

    return request(options);
  }

  deactivateUser(userIdentifier){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/users/${userIdentifier}`,
      method: 'DELETE' });

    return request(options);
  }

  getIdentityDocument(document_id) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/identity_documents/${document_id}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.is_active;
        return body;
      }
    });

    return request(options);
  }

  findIdentityDocuments(userIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/identity_documents`,
      method: 'GET',
      qs: { user_identifier: userIdentifier }
    });

    return request(options);
  }

  getPairedTruCode(trucode_id){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/paired_trucodes/${trucode_id}`,
      method: 'GET'
    });
    return request(options)
  }

  pollForPairedTruCode(trucode_id, timeout){
    promisePoller({
      taskFn: this.getPairedTruCode.bind(this, trucode_id),
      interval: 5000,
      timeout: timeout
    });
  }

  getWebSdkConfig(){
    var parsedToken = this.apiCredentials.getParsedToken()
    if(parsedToken === null){
      console.log("The provided access token is invalid. Please check your configuration")
    }else{
      const webSdkConfig = new WebSdkConfig(this.requestHelper.baseUrl, parsedToken.sub)
    return JSON.stringify(webSdkConfig)
    }
  } 
}

module.exports = Trusona