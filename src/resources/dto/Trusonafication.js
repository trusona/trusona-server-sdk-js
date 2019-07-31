class Trusonafication {

  constructor(trusonaficationBuilder) {
    this.desired_level = trusonaficationBuilder.desired_level
    this.device_identifier = trusonaficationBuilder.device_identifier
    this.trucode_id = trusonaficationBuilder.trucode_id
    this.trusona_id = trusonaficationBuilder.trusona_id
    this.user_identifier = trusonaficationBuilder.user_identifier
    this.action = trusonaficationBuilder.action
    this.resource = trusonaficationBuilder.resource
    this.expires_at = trusonaficationBuilder.expires_at
    this.user_presence = trusonaficationBuilder.user_presence
    this.prompt = trusonaficationBuilder.prompt
    this.show_identity_document = trusonaficationBuilder.show_identity_document
    this.email = trusonaficationBuilder.email
    this.custom_fields = trusonaficationBuilder.custom_fields
    this.callback_url = trusonaficationBuilder.callback_url
  }

  static get essential() {
    return new EssentialBuilder()
  }

  static get executive() {
    return new ExecutiveBuilder()
  }
}

class TrusonaficationBuilder {

  constructor(desired_level) {
    this.desired_level = desired_level
    this.prompt = true
    this.user_presence = true
    this.show_identity_document = false
    this.custom_fields = {}
  }

  deviceIdentifier(device_identifier) {
    this.device_identifier = device_identifier
    return this
  }

  truCode(trucode_id) {
    this.trucode_id = trucode_id
    return this
  }

  trusonaId(trusona_id) {
    this.trusona_id = trusona_id
    return this
  }

  userIdentifier(user_identifier) {
    this.user_identifier = user_identifier
    return this
  }

  action(action) {
    this.action = action
    return this
  }

  resource(resource) {
    this.resource = resource
    return this
  }

  expiresAt(expires_at) {
    this.expires_at = expires_at
    return this
  }

  withoutPrompt() {
    this.prompt = false
    return this
  }

  withoutUserPresence() {
    this.user_presence = false
    return this
  }

  emailAddress(email){
    this.email = email
    return this
  }

  customField(name, value){
    this.custom_fields[name] = value
    return this
  }

  callbackUrl(url) {
    this.callback_url = url
    return this
  }

  build() {
    return new Trusonafication(this)
  }
}

class EssentialBuilder extends TrusonaficationBuilder {

  constructor() {
    super(2)
  }

  withoutUserPresence() {
    super.withoutUserPresence()
    this.desired_level = 1
    return this
  }
}

class ExecutiveBuilder extends TrusonaficationBuilder {
  constructor() {
    super(3)
    this.show_identity_document = true
  }
}

module.exports = Trusonafication