const dotenv = require('dotenv').config()
const uuid = require('uuid/v4')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const assert = chai.assert

const FauxMobileClient = require('./FauxMobileClient')
const FauxWebClient = require('./FauxWebClient')
const FauxDevice = require('./FauxDevice')

const Trusona = require('../src/Trusona')
const Trusonafication = require('../src/resources/dto/Trusonafication')

const DeviceAlreadyBoundError = require('../src/resources/error/DeviceAlreadyBoundError')
const DeviceNotFoundError = require('../src/resources/error/DeviceNotFoundError')
const NoIdentityDocumentError = require('../src/resources/error/NoIdentityDocumentError')

const token = process.env.TRUSONA_TOKEN
const secret = process.env.TRUSONA_SECRET

describe('Trusona', () => {
  let trusona
  let fauxDevice

  beforeEach(async () => {
    trusona = new Trusona(token, secret, Trusona.UAT)
    fauxDevice = await FauxDevice.create()
  })

  describe('The SDK constructor', () => {
    it('should point to production by default', () => {
      assert.equal(new Trusona(token, secret).requestHelper.baseUrl, 'https://api.trusona.net')
    })
  })

  describe('Getting a valid web sdk configuration from Api Credentials', () => {
    it('Getting a valid web sdk configuration from Api Credentials', async () => {
      const fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ0cnVhZG1pbi5hcGkudHJ1c29uYS5jb20iLCJzdWIiOiIwZjAzNDhmMC00NmQ2LTQ3YzktYmE0ZC0yZTdjZDdmODJlM2UiLCJhdWQiOiJhcGkudHJ1c29uYS5jb20iLCJleHAiOjE1MTk4ODU0OTgsImlhdCI6MTQ4ODMyNzg5OCwianRpIjoiNzg4YWYwNzAtNDBiOS00N2MxLWE3ZmUtOGUwZmE1NWUwMDE1IiwiYXRoIjoiUk9MRV9UUlVTVEVEX1JQX0NMSUVOVCJ9.2FNvjG9yB5DFEcNijk8TryRtKVffiDARRcRIb75Z_Pp85MxW63rhzdLFIN6PtQ1Tzb8lHPPM_4YOe-feeLOzWw'
      const fakeSecret = 'secret'
      const fakeTrusona = new Trusona(fakeToken, fakeSecret, Trusona.UAT)
      const webSdkConfig = fakeTrusona.getWebSdkConfig()
      const parsedWebSdkConfig = JSON.parse(webSdkConfig)
      assert.equal(parsedWebSdkConfig.truCodeUrl, 'https://api.staging.trusona.net')
      assert.equal(parsedWebSdkConfig.relyingPartyId, '0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e')
    })
  })

  describe('Creating an user device', () => {
    context('for a device that does not exist', () => {
      it('should throw a DeviceNotFoundError', async () => {
        await assert.isRejected(trusona.createUserDevice(uuid(), uuid()), DeviceNotFoundError)
      })
    })

    context('for an unbound device', () => {
      it('should bind the user identifier to the device and return an activation code', async () => {
        const response = await trusona.createUserDevice(uuid(), fauxDevice.id)
        assert.exists(response.activationCode)
      })
    })

    context('for a device already bound to the same user', () => {
      it('should not error and return an activation code', async () => {
        const userIdentifier = uuid()
        await trusona.createUserDevice(userIdentifier, fauxDevice.id)
        const response = await trusona.createUserDevice(userIdentifier, fauxDevice.id)
        assert.exists(response.activationCode)
      })
    })

    context('for a device already bound to a different user', () => {
      it('should throw a DeviceAlreadyBoundError', async () => {
        await trusona.createUserDevice(uuid(), fauxDevice.id)
        await assert.isRejected(trusona.createUserDevice(uuid(), fauxDevice.id), DeviceAlreadyBoundError)
      })
    })
  })

  describe('Activating an user device', () => {
    let inactiveDevice

    beforeEach(async () => {
      inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
    })

    it('should activate an inactive device', async () => {
      const response = await trusona.activateUserDevice(inactiveDevice.activationCode)
      assert.isTrue(response.active)
    })
  })

  describe('Getting an user device', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
      .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
    })

    it('should get a user device', async () => {
      const response = await trusona.getDevice(activeDevice.deviceIdentifier)
      assert.isTrue(response.active)
    })
  })

  describe('Deactivating a user', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
      .then((inactiveDevice)  => trusona.activateUserDevice(inactiveDevice.activationCode))
      await trusona.deactivateUser(activeDevice.userIdentifier)
    })

    it('should deactivate a user device', async () => {
      const response = await trusona.getDevice(activeDevice.deviceIdentifier)
      assert.isFalse(response.active)
    })
  })

  describe('Creating an Essential Trusonafication', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
          .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
    })

    it('should create a new essential trusonafication', async () => {
      const trusonafication = Trusonafication.essential
        .deviceIdentifier(activeDevice.deviceIdentifier)
        .action('login')
        .resource('resource')
        .build()

      const response = await trusona.createTrusonafication(trusonafication)
      assert.exists(response.id)
    })
  })

  describe('Creating an Essential Trusonafication, without user presence or a prompt', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
          .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
    })

    it('should create a new essential trusonafication', async () => {
      const trusonafication = Trusonafication.essential
        .deviceIdentifier(activeDevice.deviceIdentifier)
        .action('login')
        .resource('resource')
        .withoutUserPresence()
        .withoutPrompt()
        .build()

      const response = await trusona.createTrusonafication(trusonafication)
      assert.exists(response.id)
    })
  })

  describe('Creating an Essential Trusonafication, with a TruCode', () => {

    it('should create a new essential trusonafication', async () => {
      const trusonafication = Trusonafication.essential
        .truCode('73CC202D-F866-4C72-9B43-9FCF5AF149BD')
        .action('login')
        .resource('resource')
        .build()

      const response = await trusona.createTrusonafication(trusonafication)
      assert.exists(response.id)
    })
  })

  describe('Creating an Essential Trusonafication, with the user\'s identifier', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
          .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
    })

    it('should create a new essential trusonafication', async () => {
      const trusonafication = Trusonafication.essential
      .userIdentifier(activeDevice.userIdentifier)
      .action('login')
      .resource('resource')
      .build()

      const response = await trusona.createTrusonafication(trusonafication)
      assert.exists(response.id)
    })
  })

  describe('Creating an Executive Trusonafication', () => {
    let activeDevice

    beforeEach(async () => {
      const inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
      activeDevice = await trusona.activateUserDevice(inactiveDevice.activationCode)
    })

    context('for a user without an identity document registered', () => {
      it('should throw a NoIdentityDocumentError', async () => {
        const trusonafication = Trusonafication.executive
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .resource('resource')
          .build()

        await assert.isRejected(trusona.createTrusonafication(trusonafication), NoIdentityDocumentError)
      })
    })

    context('for a user with an identity document registered', () => {
      it('should create a new executive trusonafication', async () => {
        await fauxDevice.registerAamvaDriversLicense('hash1')

        const trusonafication = Trusonafication.executive
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .resource('resource')
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.desiredLevel, 3)
        assert.equal(response.showIdentityDocument, true)
      })
    })
  })

  describe('Polling for a trusonafication', () => {
    it('should return null if trusonafication never does not exist', async () => {
      const response = await trusona.pollForTrusonafication(uuid())
      assert.isNull(response)
    })

    it('should return an expired trusonafication if not accepted', async () => {
      const activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))

      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() - 1)

      const trusonafication = await trusona.createTrusonafication(Trusonafication.essential
        .userIdentifier(activeDevice.userIdentifier)
        .action('login')
        .resource('resource')
        .expiresAt(expiresAt.toISOString())
        .build())

      const response = await trusona.pollForTrusonafication(trusonafication.id)

      assert.equal(response.status, 'EXPIRED')
    })
  })

  describe('Getting an identity document', () => {
    let document

    beforeEach(async () => {
      document = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
        .then((activeDevice) => fauxDevice.registerAamvaDriversLicense('hash1'))
    })

    it('should return null if no identity document is found', async () => {
      const response = await trusona.getIdentityDocument(uuid())
      assert.isNull(response)
    })

    it('should get an identity document based on the provided document id', async () => {
      const response = await trusona.getIdentityDocument(document.id)
      assert.equal(response.hash, 'hash1')
    })
  })

  describe('Finding identity documents', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
      await fauxDevice.registerAamvaDriversLicense('hash2')
    })

    it('should find identity documents', async () => {
      const response = await trusona.findIdentityDocuments(activeDevice.userIdentifier)
      assert.equal(response[0].hash, 'hash2')
    })
  })

  describe('Getting a paired trucode by id', () => {
    let trucode

    beforeEach(async () => {
      trucode = await FauxWebClient.createTruCode()
    })

    it('should return null if it is not paired', async () => {
      const response = await trusona.getPairedTruCode(trucode.id)
      assert.isNull(response)
    })

    it('should return the paired trucode if it was paired', async () => {
      await FauxMobileClient.pairTruCode('deviceIdentifier', trucode.payload)
      const response = await trusona.getPairedTruCode(trucode.id)
      assert.equal(response.identifier, 'deviceIdentifier')
    })
  })

  describe('Getting a paired trucode by polling', () => {
    let trucode

    beforeEach(async () => {
      trucode = await FauxWebClient.createTruCode()
    })

    it('should timeout and return null if it never gets paired', async () => {
      const response = await trusona.pollForPairedTruCode(trucode.id, 1000)
      assert.isNull(response)
    })

    it('should return the paired trucode if already paired', async () => {
      await FauxMobileClient.pairTruCode('deviceIdentifier', trucode.payload)
      const response = await trusona.pollForPairedTruCode(trucode.id, 1000)
      assert.equal(response.identifier, 'deviceIdentifier')
    })

    it('should return the paired trucode if paired while polling', async () => {
      setTimeout(() => FauxMobileClient.pairTruCode('deviceIdentifier', trucode.payload), 1000)
      const response = await trusona.pollForPairedTruCode(trucode.id, 3000)
      assert.equal(response.identifier, 'deviceIdentifier')
    })
  })
})
