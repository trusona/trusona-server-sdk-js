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

      constructor(deviceIdentifier, action, resource) {
        this.desiredLevel = 2
        this.deviceIdentifier = deviceIdentifier
        this.action = action
        this.resource = resource
        this.trucode_id = 0
        this.userIdentifier = 0;
        this.expiresAt = 0;
        this.callbackUrl = ''
        this.userPresence = false
        this.prompt = false
        this.showIdentityDocument = false 
      }
}
module.exports = Trusonafication