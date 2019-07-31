const dotenv = require('dotenv').config()
const request = require('request-promise')

const RELYING_PARTY_ID = '0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e'

const BUSTER_BASE_URL = process.env.BUSTER_BASE_URL || 'https://buster.staging.trusona.net'

const BUSTER_DEFAULTS = {
  baseUrl: `${BUSTER_BASE_URL}/faux_devices`,
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

  constructor(attributes) {
    this.id = attributes.id
  }

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

  async acceptTrusonafication(trusonaficationId) {
    return FauxDevice.requestBuster({
      url: `/${this.id}/trusonafication_responses`,
      method: 'POST',
      body: {
        trusonafication_id: trusonaficationId
      }
    })
  }

  async rejectTrusonafication(trusonaficationId) {
    return FauxDevice.requestBuster({
      url: `/${this.id}/api/v2/trusonafication_responses/${trusonaficationId}`,
      method: 'DELETE'
    })
  }

}

module.exports = FauxDevice