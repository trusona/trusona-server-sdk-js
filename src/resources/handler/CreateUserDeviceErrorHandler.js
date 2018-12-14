const GenericErrorHandler = require('./GenericErrorHandler')
const DeviceAlreadyBoundError = require('../error/DeviceAlreadyBoundError')
const DeviceNotFoundError = require('../error/DeviceNotFoundError')

const DEVICE_ALREADY_BOUND_MESSAGE = 'A different user has already been bound to this device.'
const DEVICE_NOT_FOUND_MESSAGE = 'The device you are attempting to bind to a user does not exist. The device will need to be re-registered with Trusona before attempting to bind it again.'

class CreateUserDeviceErrorHandler extends GenericErrorHandler {

  static handleError(response){
    switch(response.statusCode) {
      case 409:
        throw new DeviceAlreadyBoundError(this.formatMessage(response.statusCode, DEVICE_ALREADY_BOUND_MESSAGE))
      case 424:
        throw new DeviceNotFoundError(this.formatMessage(response.statusCode, DEVICE_NOT_FOUND_MESSAGE))
    }
    return super.handleError(response)
  }

}

module.exports = CreateUserDeviceErrorHandler