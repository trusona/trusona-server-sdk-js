var crypto = require("crypto")

class HmacSignatureGenerator {

  getSignature(hmacMessage, secret) {
    const message = hmacMessage.getHmacMessage()
    const parts = [
      message.method,
      message.bodyDigest,
      message.contentType,
      message.date,
      message.requestUri
    ]

    var valueToDigest = parts.join(`\n`)
    const hash = crypto.createHmac('sha256', secret)
                   .update(valueToDigest)
                   .digest('hex')

    return Buffer.from(hash).toString('base64')
  }
}
module.exports = HmacSignatureGenerator