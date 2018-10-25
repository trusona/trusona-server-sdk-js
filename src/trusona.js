const ActivateUserDeviceErrorHandler = require('./resources/handler/ActivateUserDeviceErrorHandler')
const CreateUserDeviceErrorHandler = require('./resources/handler/CreateUserDeviceErrorHandler')
const TrusonaficationErrorHandler = require('./resources/handler/TrusonaficationErrorHandler')
const GenericErrorHandler = require('./resources/handler/GenericErrorHandler')
const UserErrorHandler = require('./resources/handler/UserErrorHandler')
const TrusonaError = require('./resources/error/TrusonaError')
const ApiCredentials = require('./http/client/ApiCredentials')
const RequestHelper = require('./http/client/RequestHelper')
const WebSdkConfig = require('./resources/dto/WebSdkConfig')
const promisePoller = require('promise-poller').default;
const request = require('request-promise')

const PRODUCTION = "production"
const UAT = "uat";


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
        body.activationCode = body.id;
        return body;
      },
      body: {
        'user_identifier': userIdentifier,
        'device_identifier': deviceIdentifier
      }
    })

    return request(options).catch(error => {
      return CreateUserDeviceErrorHandler.handleError(error)
    })
  }

  activateUserDevice(activationCode) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/user_devices/${activationCode}`,
      method: 'PATCH',
      body: { active: true }
    })

    return request(options).catch(error => {
      return ActivateUserDeviceErrorHandler.handleError(error)
    })
  }

  createTrusonafication(trusonafication) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/trusonafications`,
      method: 'POST',
      body : trusonafication
    })

    return request(options).catch(error => {
      return TrusonaficationErrorHandler.handleError(error)
    })
  }

  getTrusonaficationResult(trusonafication_id){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/trusonafications/${trusonafication_id}`,
      method: 'GET'
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  pollForTrusonafication(trusonafication_id, timeout){
    return promisePoller({
      taskFn: this.getTrusonaficationResult.bind(this, trusonafication_id),
      interval: 5000,
      timeout: timeout,
      shouldContinue(error, result) {
        return error == null && result.status === `IN_PROGRESS`
      }
    })
  }

  getDevice(deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/devices/${deviceIdentifier}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.isActive;
        return body
      }
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  deactivateUser(userIdentifier){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/users/${userIdentifier}`,
      method: 'DELETE' 
    })

    return request(options).catch(error => {
      return UserErrorHandler.handleError(error)
    })
  }

  getIdentityDocument(document_id) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/identity_documents/${document_id}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.isActive;
        return body
      }
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  findIdentityDocuments(userIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/identity_documents`,
      method: 'GET',
      qs: { user_identifier: userIdentifier }
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  getPairedTruCode(trucode_id){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/paired_trucodes/${trucode_id}`,
      method: 'GET'
    })
    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  pollForPairedTruCode(trucode_id, timeout){
    return promisePoller({
      taskFn: this.getPairedTruCode.bind(this, trucode_id),
      interval: 5000,
      timeout: timeout,
      shouldContinue(error, result){
        return error == null && result.status === `IN_PROGRESS` //CONFIRM THIS WITH Ryan.
      }
    })
  }

  getWebSdkConfig(){
    var parsedToken = this.apiCredentials.getParsedToken()
    if(parsedToken === null){
      console.log("The provided access token is invalid. Please check your configuration")
    } else{ 
      const webSdkConfig = new WebSdkConfig(this.requestHelper.baseUrl, parsedToken.sub)
      return JSON.stringify(webSdkConfig)
    }
  } 
}

module.exports = Trusona