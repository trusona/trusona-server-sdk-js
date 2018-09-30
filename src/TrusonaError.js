class TrusonaError extends Error {

    constructor(message) {
        super(message);
        this.name = this.constructor.name;
       // Error.captureStackTrace(this, this.constructor); -> Check with Ryan to confirm if this option is needed.
    }
}

module.exports = TrusonaError