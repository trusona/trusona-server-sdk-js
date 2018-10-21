const GenericErrorHandler = require('./GenericErrorHandler')
const UserNotFoundError = require('../error/UserNotFoundError')

class UserErrorHandler extends GenericErrorHandler {

    static handleError(error){
        super.handleError(error)
        switch(error.statusCode) {
            case 404:
                throw new UserNotFoundError(error.statusCode + " - " +
                    "The user you are attempting to deactivate does not exist or is already inactive.")
        }
    }
}
module.exports = UserErrorHandler