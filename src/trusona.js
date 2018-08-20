const request = require('request-promise');
const RequestHelper = require('./RequestHelper');

class Trusona {
  constructor(token, secret) {
    this.token = token
    this.secret = secret
    this.requestHelper = new RequestHelper(this.token, this.secret);
  }

  createUserDevice(userIdentifier, deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: 'https://api.staging.trusona.net/api/v2/user_devices',
      method: 'POST',
      transform : (body, response, resolveWithFullResponse) => {
        body.activation_code = body.id;
        return body;
      },
      body: {
        'user_identifier': userIdentifier,
        'device_identifier': deviceIdentifier
      }
    });
   return request(options);
  }

  activateUserDevice(activationCode) {
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/api/v2/user_devices/${activationCode}`,
      method: 'PATCH',
      body: { active: true }
    });

   return request(options);
  }

  createTrusonafication(trusonafication) {
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/api/v2/trusonafications`,
      method: 'POST',
      body : trusonafication
    });

    return request(options);
  }

  getDevice(deviceIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/api/v2/devices/${deviceIdentifier}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.is_active;
        return body;
      }
    });

    return request(options);
  }

  deactivateUser(userIdentifier){
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/api/v2/users/${userIdentifier}`,
      method: 'DELETE' });

    return request(options);
  }

  getIdentityDocument(document_id) {
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/api/v2/identity_documents/${document_id}`,
      method: 'GET',
      transform : (body, response, resolveWithFullResponse) => {
        body.active = body.is_active;
        return body;
      }
    });

    return request(options);
  }

  findIdentityDocuments(userIdentifier) {
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/api/v2/identity_documents/`,
      method: 'GET',
      query: userIdentifier
    });

    return request(options);
  }
  
  registerAamvaDriversLicense(device_identifier){
    const options = this.requestHelper.getSignedRequest({
      url: `https://api.staging.trusona.net/${device_identifier}/api/v2/identity_documents`,
      method: 'POST',
      body: {
        'hash': "hash",
        'type': 'AAMVA_DRIVERS_LICENSE'
      }
    });
   return request(options);
  }
}

module.exports = Trusona