const dotenv = require('dotenv').config()
const uuid = require('uuid/v4')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const until = require('test-until')

chai.use(chaiAsPromised)
const assert = chai.assert

const FauxMobileClient = require('./FauxMobileClient')
const FauxWebClient = require('./FauxWebClient')
const FauxDevice = require('./FauxDevice')
const Buster = require('./Buster')

const { Trusona, Trusonafication } = require('../src/Trusona')

const DeviceAlreadyBoundError = require('../src/resources/error/DeviceAlreadyBoundError')
const DeviceNotFoundError = require('../src/resources/error/DeviceNotFoundError')
const NoIdentityDocumentError = require('../src/resources/error/NoIdentityDocumentError')
const TrusonaError = require('../src/resources/error/TrusonaError')
const UserNotFoundError = require('../src/resources/error/UserNotFoundError')
const ValidationError = require('../src/resources/error/ValidationError')

const token = process.env.TRUSONA_TOKEN
const secret = process.env.TRUSONA_SECRET
const endpoint = process.env.TRUSONA_ENDPOINT || Trusona.UAT

describe('Trusona', () => {
  let trusona
  let fauxDevice

  beforeEach(async () => {
    trusona = new Trusona(token, secret, endpoint)
    fauxDevice = await FauxDevice.create()
  })

  describe('The SDK', () => {
    it('should expose variables for configuring which environment you are pointing to', () => {
      assert.equal(Trusona.UAT, 'https://api.staging.trusona.net')
      assert.equal(Trusona.PRODUCTION, 'https://api.trusona.net')
      assert.equal(Trusona.EU_UAT, 'https://api.staging.eu.trusona.net')
      assert.equal(Trusona.EU_PRODUCTION, 'https://api.eu.trusona.net')
    })

    it('should point to production by default', () => {
      assert.equal(new Trusona(token, secret).requestHelper.baseUrl, 'https://api.trusona.net')
    })

    it('should throw a TrusonaError if credentials are invalid after making your first call', async () => {
      trusona = new Trusona(token, 'wrong-secret', Trusona.UAT)
      await assert.isRejected(trusona.getDevice(uuid()), TrusonaError, 'credentials')
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

  describe('Creating a user device', () => {
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

  describe('Activating a user device', () => {
    context('with an invalid activation code', () => {
      it('should throw a DeviceNotFoundException', async () => {
        await assert.isRejected(trusona.activateUserDevice(uuid()), DeviceNotFoundError)
      })
    })

    context('with a valid activation code', () => {
      it('should activate an inactive device', async () => {
        let inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        const response = await trusona.activateUserDevice(inactiveDevice.activationCode)
        assert.isTrue(response.active)
      })

      it('should not error if called twice', async () => {
        let inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        await trusona.activateUserDevice(inactiveDevice.activationCode)
        const response = await trusona.activateUserDevice(inactiveDevice.activationCode)
        assert.isTrue(response.active)
      })
    })
  })

  describe('Getting a user device', () => {
    let inactiveDevice

    beforeEach(async () => {
      inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
    })

    context('with a device that does not exist', () => {
      it('should return null', async () => {
        const response = await trusona.getDevice(uuid())
        assert.isNull(response)
      })
    })

    context('with an inactive device', () => {
      it('should show the device is not active', async () => {
        const response = await trusona.getDevice(inactiveDevice.deviceIdentifier)
        assert.isFalse(response.active)
      })
    })

    context('with an active device', () => {
      it('should show the device is active', async () => {
        const activeDevice = await trusona.activateUserDevice(inactiveDevice.activationCode)
        const response = await trusona.getDevice(activeDevice.deviceIdentifier)
        assert.isTrue(response.active)
      })
    })
  })

  xdescribe('Deactivating a user', () => {
    context('with a user that does not exist', () => {
      it('should throw a UserNotFoundError', async () => {
        await assert.isRejected(trusona.deactivateUser(uuid()), UserNotFoundError)
      })
    })

    context('with a user that does exist', () => {
      it('should deactivate the user and his/her devices', async () => {
        let activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
          .then((inactiveDevice)  => trusona.activateUserDevice(inactiveDevice.activationCode))

        await trusona.deactivateUser(activeDevice.userIdentifier)

        const response = await trusona.getDevice(activeDevice.deviceIdentifier)
        assert.isFalse(response.active)
      })
    })

    context('with a user that was already deactivated', () => {
      it('should throw a UserNotFoundError', async () => {
        let activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
          .then((inactiveDevice)  => trusona.activateUserDevice(inactiveDevice.activationCode))

        await trusona.deactivateUser(activeDevice.userIdentifier)

        await assert.isRejected(trusona.deactivateUser(activeDevice.userIdentifier), UserNotFoundError)
      })
    })
  })

  describe('Creating an Essential Trusonafication', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
    })

    context('with missing identifier', () => {
      it('should throw a TrusonaError', async () => {
        const trusonafication = Trusonafication.essential
          .action('login')
          .resource('resource')
          .build()

        await assert.isRejected(trusona.createTrusonafication(trusonafication), TrusonaError)
      })
    })

    context('with missing action', () => {
      it('should throw a TrusonaError', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .resource('resource')
          .build()

        await assert.isRejected(trusona.createTrusonafication(trusonafication), TrusonaError)
      })
    })

    context('with missing resource', () => {
      it('should throw a TrusonaError', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .build()

        await assert.isRejected(trusona.createTrusonafication(trusonafication), TrusonaError)
      })
    })

    context('with validation errors', () => {
      it('should throw a TrusonaError', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .build()

        await assert.isRejected(trusona.createTrusonafication(trusonafication), TrusonaError)
      })
    })

    context('with a trusona id', () => {
      xit('should create it with desired level 2 and be in progress', async () => {
        const trusonafication = Trusonafication.essential
          .trusonaId('123456789')
          .action('login')
          .resource('resource')
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.status, 'IN_PROGRESS')
        assert.equal(response.desiredLevel, 2)
        assert.isTrue(response.userPresence)
      })
    })

    context('with a device identifier', () => {
      it('should create it with desired level 2 and be in progress', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .resource('resource')
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.deviceIdentifier, activeDevice.deviceIdentifier)
        assert.equal(response.status, 'IN_PROGRESS')
        assert.equal(response.desiredLevel, 2)
        assert.isTrue(response.userPresence)
      })
    })

    context('with the user identifier', () => {
      it('should create it with desired level 2 and be in progress', async () => {
        const trusonafication = Trusonafication.essential
          .userIdentifier(activeDevice.userIdentifier)
          .action('login')
          .resource('resource')
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.userIdentifier, activeDevice.userIdentifier)
        assert.equal(response.status, 'IN_PROGRESS')
        assert.equal(response.desiredLevel, 2)
      })
    })

    context('with a tru code', () => {
      it('should create it with desired level 2 and be in progress', async () => {
        const trusonafication = Trusonafication.essential
          .truCode('73CC202D-F866-4C72-9B43-9FCF5AF149BD')
          .action('login')
          .resource('resource')
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.status, 'IN_PROGRESS')
        assert.equal(response.desiredLevel, 2)
      })
    })


    context('without user presence', () => {
      it('should set user presence to false and set the desired level to 1', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .resource('resource')
          .withoutUserPresence()
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.desiredLevel, 1)
        assert.isFalse(response.userPresence)
      })
    })

    context('without a prompt', () => {
      it('should set prompt to false ', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .resource('resource')
          .withoutPrompt()
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.isFalse(response.prompt)
      })
    })

    context('with a custom field', () => {
      it('should return the field name and value', async () => {
        const trusonafication = Trusonafication.essential
          .deviceIdentifier(activeDevice.deviceIdentifier)
          .action('login')
          .resource('resource')
          .customField('foo', 'bar')
          .build()

        const response = await trusona.createTrusonafication(trusonafication)
        assert.equal(response.customFields['foo'], 'bar')
      })
    })

    context('with a callback url', () => {
      it('should call the callback when the trusonafication is completed', async () => {
        const callbackId = uuid()

        const trusonafication = await trusona.createTrusonafication(Trusonafication.essential
          .userIdentifier(activeDevice.userIdentifier)
          .action('login')
          .resource('resource')
          .callbackUrl(Buster.getCallbackUrl(callbackId))
          .build())

        assert.exists(trusonafication)
      })
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
      beforeEach(async () => {
        await fauxDevice.registerAamvaDriversLicense('hash1')
      })

      context('with default settings', () => {
        it('should create it with desired level 3 and all flags set to true', async () => {
          const trusonafication = Trusonafication.executive
            .deviceIdentifier(activeDevice.deviceIdentifier)
            .action('login')
            .resource('resource')
            .build()

          const response = await trusona.createTrusonafication(trusonafication)
          assert.equal(response.desiredLevel, 3)
          assert.equal(response.status, 'IN_PROGRESS')
          assert.isTrue(response.showIdentityDocument)
          assert.isTrue(response.userPresence)
          assert.isTrue(response.prompt)
        })
      })

      context('without user presence', () => {
        it('should create it with desired level 3 and be in progress', async () => {
          const trusonafication = Trusonafication.executive
            .deviceIdentifier(activeDevice.deviceIdentifier)
            .action('login')
            .resource('resource')
            .withoutUserPresence()
            .build()

          const response = await trusona.createTrusonafication(trusonafication)
          assert.equal(response.desiredLevel, 3)
          assert.isFalse(response.userPresence)
        })
      })
    })
  })

  describe('Polling for a trusonafication', () => {
    context('with a trusonafication that does not exist', () => {
      it('should return null', async () => {
        const response = await trusona.pollForTrusonaficationResult(uuid())
        assert.isNull(response)
      })
    })

    context('with a trusonafication that does not get responded to', () => {
      it('should return an expired, unsuccessful trusonafication', async () => {
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

        const response = await trusona.pollForTrusonaficationResult(trusonafication.id)

        assert.equal(response.status, 'EXPIRED')
        assert.isFalse(response.successful)
      })
    })

    context('with a trusonafication that is accepted', () => {
      xit('should be successful', async () => {
        const trusonafication = await trusona.createTrusonafication(Trusonafication.essential
          .emailAddress('r@trusona.com')
          .action('login')
          .resource('resource')
          .build())

        const response = await trusona.pollForTrusonaficationResult(trusonafication.id)

        assert.isTrue(response.successful)
      })
    })

    context('with a trusonafication that is rejected', () => {
      xit('should not be successful', async () => {
        const trusonafication = await trusona.createTrusonafication(Trusonafication.essential
          .emailAddress('r@trusona.com')
          .action('login')
          .resource('resource')
          .build())

        const response = await trusona.pollForTrusonaficationResult(trusonafication.id)

        assert.isFalse(response.successful)
      })
    })
  })

  describe('Getting an identity document', () => {
    context('for a document that does not exist', () => {
      it('should return null', async () => {
        const response = await trusona.getIdentityDocument(uuid())
        assert.isNull(response)
      })
    })

    context('for a document that does exist', () => {
      it('should return the document', async () => {
        const document = await trusona.createUserDevice(uuid(), fauxDevice.id)
          .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
          .then((activeDevice) => fauxDevice.registerAamvaDriversLicense('hash1'))

        const response = await trusona.getIdentityDocument(document.id)
        assert.equal(response.hash, 'hash1')
      })
    })
  })

  describe('Finding identity documents', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
    })

    context('for a user with no registered documents', () => {
      it('should return an empty array', async () => {
        const response = await trusona.findIdentityDocuments(activeDevice.userIdentifier)
        assert.deepEqual(response, [])
      })
    })

    context('for a user with a registered document', () => {
      it('should return the documents', async () => {
        await fauxDevice.registerAamvaDriversLicense('hash2')

        const response = await trusona.findIdentityDocuments(activeDevice.userIdentifier)
        assert.equal(response[0].hash, 'hash2')
        assert.equal(response[0].verificationStatus, 'UNVERIFIED')
      })
    })

    context('with a blank user identifier', () => {
      it('should throw a ValidationError', async () => {
        await assert.isRejected(trusona.findIdentityDocuments(''), ValidationError)
      })
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
