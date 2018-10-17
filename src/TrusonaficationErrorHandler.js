const GenericErrorHandler = require('./GenericErrorHandler')
const TrusonaError = require('./TrusonaError')

class TrusonaficationErrorHandler extends GenericErrorHandler {

    static handleError(error){
        super.handleError(error)
        switch(error.statusCode) {
            case 424:
                throw new TrusonaError(error.statusCode + " - " +
                    error.message);
        }
    }
}

module.exports = TrusonaficationErrorHandler