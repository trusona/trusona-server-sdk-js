const TrusonaError = require('../../resources/error/TrusonaError')

class GenericErrorHandler {

    static handleError(error){
        if (error.statusCode == 400) {
            throw new TrusonaError(error.statusCode + " - " +
                "The Trusona SDK was unable to fulfill your request do to an error with the SDK. Contact Trusona to determine the issue.")
        }
        else if (error.statusCode == 403) {
            throw new TrusonaError(error.statusCode + " - " +
                "The token and/or secret you are using are invalid. Contact Trusona to get valid Server SDK credentials.")
        }
        else if (error.statusCode == 404) {
            //no-op since 404 results in null
        }
        else if (error.statusCode == 422) {
            var parsedError = JSON.parse(response.error)

            throw new TrusonaError(error.statusCode + " - " +
                parsedError.description)
        }
        else if (error.statusCode >= 500 && error.statusCode < 600) {
            throw new TrusonaError(error.statusCode + " - " +
              "The server was unable to process your request at this time. Feel free to try your request again later.")
        }
    }
}
module.exports = GenericErrorHandler