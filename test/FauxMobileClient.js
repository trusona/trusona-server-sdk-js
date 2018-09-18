const dotenv = require('dotenv').config()
const request = require('request-promise')

const RELYING_PARTY_ID = '0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e'

const BUSTER_DEFAULTS = {
    baseUrl: 'https://api.staging.trusona.net/api/v2/paired_trucodes',
    json: true,
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
    }
}

class FauxMobileClient {

    static async pairTruCode(id, payload) {
        return request(Object.assign(BUSTER_DEFAULTS, {
        url: '/',
        body: { payload: payload, identifier: id },
        method: 'POST'}))
    }
}

module.exports = FauxMobileClient