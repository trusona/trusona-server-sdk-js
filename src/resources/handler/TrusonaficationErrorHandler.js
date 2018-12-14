const GenericErrorHandler = require('./GenericErrorHandler')
const NoIdentityDocumentError = require('../error/NoIdentityDocumentError')
const TrusonaError = require('../error/TrusonaError')

class TrusonaficationErrorHandler extends GenericErrorHandler {

  static handleError(response) {
    if (response.statusCode === 424) {
      const parsedError = JSON.parse(response.error)
      if (parsedError.error === 'NO_DOCUMENTS') {
        throw new NoIdentityDocumentError(parsedError.description)
      }
      else {
        throw new TrusonaError(this.formatMessage(response.statusCode, parsedError.description))
      }
    }
    return super.handleError(response)
  }

}

module.exports = TrusonaficationErrorHandler