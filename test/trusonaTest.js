const chai = require('chai');
const assert = chai.assert;

const dotenv = require('dotenv').config()
const request = require('request-promise')
const uuid = require('uuid/v4')
const Trusona = require('../src/trusona')

const token = process.env.TRUSONA_TOKEN
const secret = process.env.TRUSONA_SECRET

const createFauxDevice = () => {
  const options = {
    url: 'https://buster.staging.trusona.net/faux_devices',
    method: 'POST',
    json: true,
    body: {"relying_party_id": "0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e"},
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return request.post(options);
}

describe('Trusona', () => {
  let trusona

  beforeEach(() => {
    trusona = new Trusona(token, secret);
  });

  describe('createUserDevice', () => {
    it('should bind a user identifier to a device', async () => {
      const response = await createFauxDevice()
          .then((fauxDevice) => {
           return trusona.createUserDevice(uuid(), fauxDevice.id);
          });
      console.log(response);
      assert.exists(response.id);
    });
  });
})