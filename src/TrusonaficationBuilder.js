const Trusonafication = require('./Trusonafication');

class TrusonaficationBuilder {
    constructor(desired_level) {
       this.desired_level = desired_level;
       this.prompt = true;
       this.user_presence = true;
       this.show_identity_document = false;
    }
    
    deviceIdentifier(device_identifier) {
       this.device_identifier = device_identifier;
       return this;
    }
    trucode(trucode_id) {
     this.trucode_id = trucode_id;
     return this;
    }
    userIdentifier(user_identifier) {
        this.user_identifier = user_identifier;
        return this;
     }
    action(action) {
     this.action = action;
     return this;
    }
    resource(resource) {
     this.resource = resource;
     return this;
    }
    callbackUrl(callback_url) {
     this.callback_url = callback_url;
     return this;
    }
    expiresAt(expires_at) {
     this.expires_at = expires_at;
     return this;
    }
    withoutPrompt() {
     this.prompt = false;
     return this;
    }
    withoutUserPresence() {
     this.user_presence = false;
     return this;
    }

    build() {
       return new Trusonafication(this);
    }
 }

 module.exports = TrusonaficationBuilder