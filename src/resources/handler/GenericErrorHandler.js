const TrusonaError = require('../../resources/error/TrusonaError')
const ValidationError = require('../../resources/error/ValidationError')

class GenericErrorHandler {

    static handleError(response){
        if (response.statusCode == 400) {
            throw new TrusonaError(response.statusCode + " - " +
                "The Trusona SDK was unable to fulfill your request do to an error with the SDK. Contact Trusona to determine the issue.")
        }
        else if (response.statusCode == 403) {
            throw new TrusonaError(response.statusCode + " - " +
                "The token and/or secret you are using are invalid. Contact Trusona to get valid Server SDK credentials.")
        }
        else if (response.statusCode == 404) {
            return null
        }
        else if (response.statusCode == 422) {
            var parsedError = JSON.parse(response.error)

            throw new ValidationError(response.statusCode + " - " +
                parsedError.description, parsedError.field_errors)
        }
        else if (response.statusCode >= 500 && response.statusCode < 600) {
            throw new TrusonaError(response.statusCode + " - " +
              "The server was unable to process your request at this time. Feel free to try your request again later.")
        }
    }

}
module.exports = GenericErrorHandler