const GenericErrorHandler = require('./GenericErrorHandler')
const UserNotFoundError = require('../error/UserNotFoundError')

class UserErrorHandler extends GenericErrorHandler {

    static handleError(response){
        super.handleError(response)
        switch(response.statusCode) {
            case 404:
                throw new UserNotFoundError(response.statusCode + " - " +
                    "The user you are attempting to deactivate does not exist or is already inactive.")
        }
    }
}
module.exports = UserErrorHandler