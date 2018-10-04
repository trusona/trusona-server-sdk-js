const GenericErrorHandler = require('./GenericErrorHandler')
const DeviceNotFoundError = require('./DeviceNotFoundError')

class ActivateUserDeviceHandler extends GenericErrorHandler {

    static handleError(error){
        super.handleError(error)
        switch(error.statusCode) {
            case 404:
                throw new DeviceNotFoundError(error.statusCode + " - " +
                    "The device you are attempting to activate does not exist. " +
                    "You will need to re-register the device and re-bind it to the user to get a new activation code.");
        }
    }
}

module.exports = ActivateUserDeviceHandler