const TrusonaError = require('./TrusonaError')

class DeviceNotFoundError extends TrusonaError {

    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = DeviceNotFoundError