const dotenv = require('dotenv').config()
const request = require('request-promise')

const RELYING_PARTY_ID = '0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e'

const BUSTER_DEFAULTS = {
  baseUrl: 'https://buster.staging.trusona.net/faux_devices',
  json: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json'
  },
  auth: {
    user: process.env.BUSTER_USERNAME,
    pass: process.env.BUSTER_PASSWORD
  }
}

class FauxDevice {

  static async requestBuster(options) {
    return request(Object.assign(BUSTER_DEFAULTS, options))
  }

  static async create() {
    const newDevice = await FauxDevice.requestBuster({
      url: '/',
      body: { relying_party_id: RELYING_PARTY_ID },
      method: 'POST'
    })

    return new FauxDevice(newDevice)
  }

  constructor(attributes) {
    this.id = attributes.id
  }

  async sync() {
    return FauxDevice.requestBuster({
      url: `/${this.id}`,
      method: 'GET'
    })
  }

  async registerAamvaDriversLicense(hash) {
    return FauxDevice.requestBuster({
      url: `/${this.id}/api/v2/identity_documents`,
      method: 'POST',
      body: {
        hash: hash,
        type: 'AAMVA_DRIVERS_LICENSE'
      }
    })
  }
}

module.exports = FauxDevice