const dotenv = require('dotenv').config()
const request = require('request-promise')

const BUSTER_BASE_URL = process.env.BUSTER_BASE_URL || 'https://buster.staging.trusona.net'

const BUSTER_DEFAULTS = {
  baseUrl: `${BUSTER_BASE_URL}`,
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

class Buster {

  static async requestBuster(options) {
    return request(Object.assign(BUSTER_DEFAULTS, options))
  }

  static getCallbackUrl(id) {
    return `${BUSTER_BASE_URL}/callbacks/${id}`
  }

  static async getCallback(id) {
    return Buster.requestBuster({
      url: `/callbacks/${id}`,
      method: 'GET'
    })
  }
}

module.exports = Buster