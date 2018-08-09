const trusonaficationBuilder = require('./TrusonaficationBuilder');
const EssentialBuilder = require('./EssentialBuilder');
const ExecutiveBuilder = require('./ExecutiveBuilder');

class Trusonafication {

  constructor(trusonaficationBuilder) {
    this.desired_level = trusonaficationBuilder.desired_level
    this.device_identifier = trusonaficationBuilder.device_identifier
    this.trucode_id = trusonaficationBuilder.trucode_id
    this.user_identifier = trusonaficationBuilder.user_identifier
    this.action = trusonaficationBuilder.action
    this.resource = trusonaficationBuilder.resource
    this.expires_at = trusonaficationBuilder.expires_at
    this.callback_url = trusonaficationBuilder.callback_url
    this.user_presence = trusonaficationBuilder.user_presence
    this.prompt = trusonaficationBuilder.prompt
    this.show_identity_document = trusonaficationBuilder.show_identity_document

  }

  static get EssentialBuilder() {
    return EssentialBuilder;
  }

  static get ExecutiveBuilder() {
    return ExecutiveBuilder;
  }

}
module.exports = Trusonafication