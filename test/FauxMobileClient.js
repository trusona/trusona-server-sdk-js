const request = require('request-promise')

const ENDPOINT = process.env.TRUSONA_ENDPOINT || 'https://api.staging.trusona.net'

const TRUCODE_DEFAULTS  = {
  baseUrl: `${ENDPOINT}/api/v2/paired_trucodes`,
  json: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json'
  }
}

class FauxMobileClient {

  static async pairTruCode(id, payload) {
    return request(Object.assign(TRUCODE_DEFAULTS, {
      url: '/',
      body: { payload: payload, identifier: id },
      method: 'POST'}))
  }
}

module.exports = FauxMobileClient