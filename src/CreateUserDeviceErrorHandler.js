const GenericErrorHandler = require('./GenericErrorHandler')
const DeviceAlreadyBoundError = require('./DeviceAlreadyBoundError')
const DeviceNotFoundError = require('./DeviceNotFoundError')

class CreateUserDeviceErrorHandler extends GenericErrorHandler {

    static handleError(error){
        super.handleError(error)
        if (error.statusCode == 409) {
            throw new DeviceAlreadyBoundError(
                "A different user has already been bound to this device.");
        }
        else if (error.statusCode == 424) {
            throw new DeviceNotFoundError(error.statusCode + " - " +
                "The device you are attempting to bind to a user does not exist. " +
              "The device will need to be re-registered with Trusona before attempting to bind it again.");
        }
    }
}

module.exports = CreateUserDeviceErrorHandler