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

const createTwoSecondDelay = (input) => {
  return new Promise(fulfill => {
    setTimeout(() => fulfill(input), 2000)
  })
}

describe('Trusona', () => {
  let trusona
  let fauxDevice

  beforeEach(async () => {
    trusona = new Trusona(token, secret);
    fauxDevice = await createFauxDevice();
  });

  describe('createUserDevice', () => {
    it('should bind a user identifier to a device', async () => {
      const response = await trusona.createUserDevice(uuid(), fauxDevice.id);
      assert.exists(response.activation_code);
    });
  });
})