const ActivateUserDeviceErrorHandler = require('./resources/handler/ActivateUserDeviceErrorHandler')
const CreateUserDeviceErrorHandler = require('./resources/handler/CreateUserDeviceErrorHandler')
const TrusonaficationErrorHandler = require('./resources/handler/TrusonaficationErrorHandler')
const GenericErrorHandler = require('./resources/handler/GenericErrorHandler')
const UserErrorHandler = require('./resources/handler/UserErrorHandler')
const ApiCredentials = require('./http/client/ApiCredentials')
const RequestHelper = require('./http/client/RequestHelper')
const WebSdkConfig = require('./resources/dto/WebSdkConfig')
const promisePoller = require('promise-poller').default
const request = require('request-promise')

const PRODUCTION = 'production'
const UAT = 'uat'

const DEFAULT_POLLING_INTERVAL = 5000

class Trusona {

  constructor(token, secret, env = PRODUCTION) {
    this.apiCredentials = new ApiCredentials(token, secret)
    this.requestHelper = new RequestHelper(token, secret, env)
  }

  static get UAT() {
    return UAT
  }

  static get PRODUCTION() {
    return PRODUCTION
  }

  createUserDevice(userIdentifier, deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: '/api/v2/user_devices',
      method: 'POST',
      transform : (body, response, resolveWithFullResponse) => {
        body.activationCode = body.id
        return body
      },
      body: {
        user_identifier: userIdentifier,
        device_identifier: deviceIdentifier
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
      url: '/api/v2/trusonafications',
      method: 'POST',
      body : trusonafication
    })

    return request(options).catch(error => {
      return TrusonaficationErrorHandler.handleError(error)
    })
  }

  getTrusonaficationResult(trusonaficationId){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/trusonafications/${trusonaficationId}`,
      method: 'GET'
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  pollForTrusonafication(trusonaficationId){
    return promisePoller({
      taskFn: this.getTrusonaficationResult.bind(this, trusonaficationId),
      interval: DEFAULT_POLLING_INTERVAL,
      shouldContinue(error, result) {
        return error === null && result && result.status === 'IN_PROGRESS'
      }
    })
  }

  getDevice(deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/devices/${deviceIdentifier}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.isActive
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

  getIdentityDocument(documentId) {
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/identity_documents/${documentId}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.isActive
        return body
      }
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  findIdentityDocuments(userIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: '/api/v2/identity_documents',
      method: 'GET',
      qs: { user_identifier: userIdentifier }
    })

    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  getPairedTruCode(truCodeId){
    const options = this.requestHelper.getSignedRequest({
      url: `/api/v2/paired_trucodes/${truCodeId}`,
      method: 'GET'
    })
    return request(options).catch(error => {
      return GenericErrorHandler.handleError(error)
    })
  }

  pollForPairedTruCode(truCodeId, timeout) {
    const pollingInterval = Math.min(DEFAULT_POLLING_INTERVAL, timeout)
    const retries = Math.floor(timeout / pollingInterval) + 1

    return promisePoller({
      taskFn: this.getPairedTruCode.bind(this, truCodeId),
      interval: pollingInterval,
      masterTimeout: pollingInterval * retries,
      shouldContinue(error, result){
        return error === null && result === null
      }
    })
    .catch((error) => {
      if (error === 'master timeout') {
        return null
      }
      throw error
    })
  }

  getWebSdkConfig() {
    const parsedToken = this.apiCredentials.getParsedToken()
    if(parsedToken === null){
      console.log('The provided access token is invalid. Please check your configuration')
    } else{
      const webSdkConfig = new WebSdkConfig(this.requestHelper.baseUrl, parsedToken.sub)
      return JSON.stringify(webSdkConfig)
    }
  }
}

module.exports = Trusona
