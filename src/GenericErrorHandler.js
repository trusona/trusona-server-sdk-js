const TrusonaError = require('./TrusonaError')

class GenericErrorHandler {

    static handleError(error){

        if (error.statusCode == 400) {
            throw new TrusonaError(
                "The Trusona SDK was unable to fulfill your request do to an error with the SDK. Contact Trusona to determine the issue.");
        }
        else if (error.statusCode == 403) {
            throw new TrusonaError(
                "The token and/or secret you are using are invalid. Contact Trusona to get valid Server SDK credentials.");
        }
        else if (error.statusCode == 404) {
            //no-op since 404 results in null
        }
        else if (error.statusCode >= 500 && error.statusCode < 600) {
            throw new TrusonaError(
              "The server was unable to process your request at this time. Feel free to try your request again later.");
        }
        //throw new TrusonaError('Generic Error Message ' +  error.statusCode);
    }
}

module.exports = GenericErrorHandler