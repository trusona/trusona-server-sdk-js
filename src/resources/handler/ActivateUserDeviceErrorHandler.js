const GenericErrorHandler = require('../../http/client/GenericErrorHandler')
const DeviceNotFoundError = require('../error/DeviceNotFoundError')

class ActivateUserDeviceErrorHandler extends GenericErrorHandler {

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

module.exports = ActivateUserDeviceErrorHandler