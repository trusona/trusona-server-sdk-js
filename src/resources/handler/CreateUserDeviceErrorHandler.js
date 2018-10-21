const GenericErrorHandler = require('./GenericErrorHandler')
const DeviceAlreadyBoundError = require('../error/DeviceAlreadyBoundError')
const DeviceNotFoundError = require('../error/DeviceNotFoundError')

class CreateUserDeviceErrorHandler extends GenericErrorHandler {

    static handleError(response){
        super.handleError(response)
        switch(response.statusCode) {
            case 409:
                throw new DeviceAlreadyBoundError(response.statusCode + " - " +
                    "A different user has already been bound to this device.")
            case 424:
                throw new DeviceNotFoundError(response.statusCode + " - " +
                    "The device you are attempting to bind to a user does not exist. " +
                    "The device will need to be re-registered with Trusona before attempting to bind it again.")
        }
    }
}

module.exports = CreateUserDeviceErrorHandler