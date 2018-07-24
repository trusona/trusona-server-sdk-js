const chai = require('chai');
const assert = chai.assert;

const HmacSignatureGenerator = require('../src/HmacSignatureGenerator')

class MockHmacMessage {
  getHmacMessage() {
    return {
      bodyDigest: "d41d8cd98f00b204e9800998ecf8427e",
      requestUri: "/test/auth?blah=blah",
      contentType: "application/json",
      date: "Tue, 27 Jun 2017 18:03:47 GMT",
      method: "GET"
    }
  }
}

describe('HmacSignatureGenerator', function() {
  it('should generate the correct signature', function() {
    const expectedSignature = "YTgwNDgzNGRjNTA0YjBkYWJmNmFlMzU0MjJiNmRmYTRjNjk5NTQxMDk3MGFkN2YzZjlmZTYyMjdlMTlkNjc4Zg=="
    const secret = "7f1dd753b6fa473d07c99b56d43bd5da3cd928487d5022e1810fab96c70945b01ad2603585542d33a1383b1f14b5880373474ff40c76a38df19052cefeb3a3eb"

    const signatureGenerator = new HmacSignatureGenerator();
    const hmacMessage = new MockHmacMessage();

    const actualSignature = signatureGenerator.getSignature(hmacMessage, secret)
    assert.equal(expectedSignature, actualSignature);
  });
});
