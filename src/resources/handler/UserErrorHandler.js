const GenericErrorHandler = require('./GenericErrorHandler')
const UserNotFoundError = require('../error/UserNotFoundError')

const USER_NOT_FOUND_MESSAGE = 'The user you are attempting to deactivate does not exist or is already inactive.'

class UserErrorHandler extends GenericErrorHandler {

  static handleError(response) {
    if (response.statusCode === 404) {
      throw new UserNotFoundError(this.formatMessage(response.statusCode, USER_NOT_FOUND_MESSAGE))
    }
    return super.handleError(response)
  }

}

module.exports = UserErrorHandler