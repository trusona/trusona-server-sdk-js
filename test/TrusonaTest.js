const Trusonafication = require('../src/resources/dto/Trusonafication')
const FauxMobileClient = require('./FauxMobileClient')
const FauxWebClient = require('./FauxWebClient')
const FauxDevice = require('./FauxDevice')
const Trusona = require('../src/Trusona')
const dotenv = require('dotenv').config()
const uuid = require('uuid/v4')
const chai = require('chai')
const assert = chai.assert

const token = process.env.TRUSONA_TOKEN
const secret = process.env.TRUSONA_SECRET

describe('Trusona', () => {
  let trusona
  let fauxDevice

  beforeEach(async () => {
    trusona = new Trusona(token, secret, Trusona.UAT)
    fauxDevice = await FauxDevice.create()
  })

  describe('Getting a valid web sdk configuration from Api Credentials', () => {
    it('Getting a valid web sdk configuration from Api Credentials', async () => {
      const fakeToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ0cnVhZG1pbi5hcGkudHJ1c29uYS5jb20iLCJzdWIiOiIwZjAzNDhmMC00NmQ2LTQ3YzktYmE0ZC0yZTdjZDdmODJlM2UiLCJhdWQiOiJhcGkudHJ1c29uYS5jb20iLCJleHAiOjE1MTk4ODU0OTgsImlhdCI6MTQ4ODMyNzg5OCwianRpIjoiNzg4YWYwNzAtNDBiOS00N2MxLWE3ZmUtOGUwZmE1NWUwMDE1IiwiYXRoIjoiUk9MRV9UUlVTVEVEX1JQX0NMSUVOVCJ9.2FNvjG9yB5DFEcNijk8TryRtKVffiDARRcRIb75Z_Pp85MxW63rhzdLFIN6PtQ1Tzb8lHPPM_4YOe-feeLOzWw"
      const fakeSecret = "secret"
      const fakeTrusona = new Trusona(fakeToken, fakeSecret, Trusona.UAT)
      const webSdkConfig = fakeTrusona.getWebSdkConfig()
      const parsedWebSdkConfig = JSON.parse(webSdkConfig)
      assert.equal(parsedWebSdkConfig.truCodeUrl, "https://api.staging.trusona.net")
      assert.equal(parsedWebSdkConfig.relyingPartyId, "0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e")
    })
  })

  describe('Creating an user device', () => {
    it('should bind a user identifier to a device', async () => {
      const response = await trusona.createUserDevice(uuid(), fauxDevice.id)
      assert.exists(response.activationCode)
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
        .action("login")
        .resource("resource")
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
        .action("login")
        .resource("resource")
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
        .truCode("73CC202D-F866-4C72-9B43-9FCF5AF149BD")
        .action("login")
        .resource("resource")
        .build();

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
      .action("login")
      .resource("resource")
      .build()

      const response = await trusona.createTrusonafication(trusonafication)
      assert.exists(response.id)
    })
  })

  describe('Getting an identity document', () => {
    let document

    beforeEach(async () => {
      document = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
        .then((activeDevice) => fauxDevice.registerAamvaDriversLicense('hash1'))
    })

    it('should get an identity document based on the provided document id', async () => {
      const response = await trusona.getIdentityDocument(document.id);
      assert.equal(response.hash, 'hash1');
    });
  });

  describe('Creating an Executive Trusonafication', () => {
    let activeDevice

    beforeEach(async () => {
      activeDevice = await trusona.createUserDevice(uuid(), fauxDevice.id)
        .then((inactiveDevice) => trusona.activateUserDevice(inactiveDevice.activationCode))
      await fauxDevice.registerAamvaDriversLicense('hash1')
    })

    it('should create a new executive trusonafication', async () => {
      const trusonafication = Trusonafication.executive
        .deviceIdentifier(activeDevice.deviceIdentifier)
        .action("login")
        .resource("resource")
        .build()

      const response = await trusona.createTrusonafication(trusonafication)
      assert.equal(response.desiredLevel, 3)
      assert.equal(response.showIdentityDocument, true)
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

  describe('Getting a paired trucode by request', () => {
    let trucode

    beforeEach(async () => {
      trucode = await FauxWebClient.createTruCode()
      await FauxMobileClient.pairTruCode('deviceIdentifier', trucode.payload)
    })

    it('should get a paired trucode by request', async () => {
      const response = await trusona.getPairedTruCode(trucode.id)
      assert.equal(response.identifier, 'deviceIdentifier')
    })
  })

  // describe('Getting a paired trucode by polling', () => {
  //   let trucode

  //   beforeEach(async () => {
  //     trucode = await FauxWebClient.createTruCode()
  //     await FauxMobileClient.pairTruCode('deviceIdentifier', trucode.payload)
  //   })

  //   it('should get a paired trucode by polling', async () => {
  //     trusona.pollForPairedTruCode(trucode.id, 1000).then(response =>
  //       assert.equal(response.identifier, 'deviceIdentifier'));
  //   })
  // })

  // describe('Getting an Essential Trusonafication by using email address', () => {
  //   let response

  //   beforeEach(async () => {
  //     const trusonafication = Trusonafication.essential
  //     .emailAddress("r@trusona.com")
  //     .action("login")
  //     .resource("resource")
  //     .build()
  //     response = await trusona.createTrusonafication(trusonafication)
  //   })

  //   it('should get a new essential trusonafication', async () => {
  //     const result = await trusona.pollForTrusonafication(response.id, 10000)
  //     assert.equal(result.status, `ACCEPTED`)
  //   })
  // })
})
