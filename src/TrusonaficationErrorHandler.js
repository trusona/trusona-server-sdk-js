const GenericErrorHandler = require('./GenericErrorHandler')
const TrusonaError = require('./TrusonaError')

class TrusonaficationErrorHandler extends GenericErrorHandler {

    static handleError(error){
        super.handleError(error)
        switch(error.statusCode) {
            case 424:
                //if (errorResponse.getError().equals("NO_DOCUMENTS")) {
                //    throw new NoIdentityDocumentsError(errorResponse.getDescription()); }
                throw new TrusonaError(error.statusCode + " - " +
                    "Generic Error Message");
        }
    }
}

module.exports = TrusonaficationErrorHandler