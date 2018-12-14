const TrusonaError = require('./TrusonaError')

class ValidationError extends TrusonaError {

  constructor(message, fieldErrors){
    super(message)
    this.fieldErrors = fieldErrors
  }
}

module.exports = ValidationError