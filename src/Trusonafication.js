class Trusonafication {

    // constructor(desiredLevel, deviceIdentifier, trucode_id, userIdentifier, action, resource, expiresAt,
    //     callbackUrl, userPresence, prompt, showIdentityDocument) {
    //     this.desiredLevel = desiredLevel
    //     this.deviceIdentifier = deviceIdentifier
    //     this.trucode_id = trucode_id
    //     this.userIdentifier = userIdentifier
    //     this.action = action
    //     this.resource = resource
    //     this.expiresAt = expiresAt
    //     this.callbackUrl = callbackUrl
    //     this.userPresence = userPresence
    //     this.prompt = prompt
    //     this.showIdentityDocument = showIdentityDocument
    //   }

      constructor(deviceIdentifier, action, resource, user_presence, prompt, user_identifier, trucode_id) {
        this.desired_level = 2
        this.device_identifier = deviceIdentifier
        this.user_identifier = user_identifier
        this.action = action
        this.resource = resource
        this.user_presence = user_presence
        this.prompt = prompt
        this.trucode_id = trucode_id
        this.show_identity_document = false
      }
}
module.exports = Trusonafication