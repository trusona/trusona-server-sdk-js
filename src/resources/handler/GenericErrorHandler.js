const TrusonaError = require('../../resources/error/TrusonaError')
const ValidationError = require('../../resources/error/ValidationError')

const SDK_ERROR_MESSAGE = 'The Trusona SDK was unable to fulfill your request do to an error with the SDK. Contact Trusona to determine the issue.'
const INVALID_CREDENTIALS_MESSAGE = 'The token and/or secret you are using are invalid. Contact Trusona to get valid Server SDK credentials.'
const SERVER_ERROR_MESSAGE = 'The server was unable to process your request at this time. Feel free to try your request again later.'

class GenericErrorHandler {

  static handleError(response){
    if (response.statusCode == 400) {
      throw new TrusonaError(this.formatMessage(response.statusCode, SDK_ERROR_MESSAGE))
    }
    else if (response.statusCode == 403) {
      throw new TrusonaError(this.formatMessage(response.statusCode, INVALID_CREDENTIALS_MESSAGE))
    }
    else if (response.statusCode == 404) {
      return null
    }
    else if (response.statusCode == 422) {
      const parsedError = JSON.parse(response.error)
      throw new ValidationError(this.formatMessage(response.statusCode, parsedError.description), parsedError.field_errors)
    }
    else if (response.statusCode >= 500 && response.statusCode < 600) {
      throw new TrusonaError(this.formatMessage(response.statusCode, SERVER_ERROR_MESSAGE))
    }
  }

  static formatMessage(statusCode, message) {
    return `${statusCode} - ${message}`
  }

}
module.exports = GenericErrorHandler