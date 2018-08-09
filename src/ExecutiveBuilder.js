const TrusonaficationBuilder = require('./TrusonaficationBuilder');

class ExecutiveBuilder extends TrusonaficationBuilder{
    constructor() {
      super(3)
      this.show_identity_document = true
    }
}

module.exports = ExecutiveBuilder