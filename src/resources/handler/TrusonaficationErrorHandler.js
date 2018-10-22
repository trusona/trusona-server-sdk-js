const GenericErrorHandler = require('./GenericErrorHandler')
const NoIdentityDocumentError = require('../error/NoIdentityDocumentError')
const TrusonaError = require('../error/TrusonaError')

class TrusonaficationErrorHandler extends GenericErrorHandler {

    static handleError(response){
        var parsedError = JSON.parse(response.error)
        super.handleError(response)
        switch(response.statusCode) {
            case 424:
                if(parsedError.error === "NO_DOCUMENTS"){
                    throw new NoIdentityDocumentError(parsedError.description)
                }
                else{
                    throw new TrusonaError(response.statusCode + " - " +
                    parsedError.description)
                }
            
        }
    }
}
module.exports = TrusonaficationErrorHandler