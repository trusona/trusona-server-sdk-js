const GenericErrorHandler = require('./GenericErrorHandler')
const DeviceNotFoundError = require('../error/DeviceNotFoundError')

const DEVICE_NOT_FOUND_MESSAGE = 'The device you are attempting to activate does not exist. You will need to re-register the device and re-bind it to the user to get a new activation code.'

class ActivateUserDeviceErrorHandler extends GenericErrorHandler {

  static handleError(response){
    if (response.statusCode === 404) {
      throw new DeviceNotFoundError(this.formatMessage(response.statusCode, DEVICE_NOT_FOUND_MESSAGE))
    }
    return super.handleError(response)
  }

}

module.exports = ActivateUserDeviceErrorHandler