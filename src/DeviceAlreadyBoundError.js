const TrusonaError = require('./TrusonaError')

class DeviceAlreadyBoundError extends TrusonaError {

    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = DeviceAlreadyBoundError