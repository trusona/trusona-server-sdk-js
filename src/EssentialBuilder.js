const TrusonaficationBuilder = require('./TrusonaficationBuilder');

class EssentialBuilder extends TrusonaficationBuilder{
    
    constructor() {
      super(2)
    }

    withoutUserPresence() {
        super.withoutUserPresence()
        this.desired_level = 1;
        return this;
    }
}

module.exports = EssentialBuilder