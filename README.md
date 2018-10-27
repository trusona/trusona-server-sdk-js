# Trusona Server SDK

The Trusona Server SDK allows simplified interaction with the Trusona API.


## Table of Contents

1. [Prerequisites](#prerequisites)
   1. [Server SDK API Credentials](#server-sdk-api-credentials)
   1. [System requirements](#system-requirements)
1. [NPM Setup](#npm-setup)
   1. [Installing the Trusona Package](#installing-the-trusona-package)
1. [Integrating the API into a project](#integrating-the-api-into-a-project)
   1. [Creating a Trusona object](#creating-a-trusona-object)
   1. [Registering devices with Trusona](#registering-devices-with-trusona)
      1. [Binding a device to a user](#binding-a-device-to-a-user)
      1. [Activating a device](#activating-a-device)
   1. [Creating Trusonafications](#creating-trusonafications)
      1. [Creating an Essential Trusonafication](#creating-an-essential-trusonafication)
      1. [Creating an Essential Trusonafication, without user presence or a prompt](#creating-an-essential-trusonafication-without-user-presence-or-a-prompt)
      1. [Creating an Essential Trusonafication, with a TruCode](#creating-an-essential-trusonafication-with-a-trucode)
      1. [Creating an Essential Trusonafication, with the user's identifier](#creating-an-essential-trusonafication-with-the-users-identifier)
      1. [Creating an Essential Trusonafication, with the user's email](#creating-an-essential-trusonafication-with-the-users-email)
      1. [Creating an Executive Trusonafication](#creating-an-executive-trusonafication)
   1. [Using TruCode for device discovery](#using-trucode-for-device-discovery)
   1. [Retrieving identity documents](#retrieving-identity-documents)
      1. [Retrieving all identity documents for a user](#retrieving-all-identity-documents-for-a-user)
      1. [Retrieving a specific identity document](#retrieving-a-specific-identity-document)
      1. [Identity document verification statuses](#identity-document-verification-statuses)
      1. [Identity document types](#identity-document-types)
   1. [Retrieving a device](#retrieving-a-device)
   1. [Deactivating a user](#deactivating-a-user) 
   1. [Handling errors](#handling-errors)


## Prerequisites

### Server SDK API Credentials

The Server SDK requires API credentials that are used by the SDK to identify and authenticate requests from your application to the Trusona APIs.

The two credentials required by the SDK include a `token` and `secret`. Both are strings generated and distributed by Trusona.

*NOTE:* The `token` and `secret` should not be shared with anyone. They are how you authenticate to the Trusona services, and you should not check them into source control.


### System requirements

The Trusona Server SDK requires nodejs # or above.


## NPM Setup


### Installing the Trusona Package

In your project, run the following command to install the latest version of the Trusona SDK.

```
npm i trusona-server-sdk
```

Alternatively, you may also search for the NPM package in www.npmjs.com


## Integrating the API into a project

### Creating a Trusona object

The `Trusona` class is the main class you will interact with to talk to the Trusona APIs. It can be created with the `token` and `secret` provided by [Trusona](#server-sdk-api-credentials).

*NOTE:* The `token` and `secret` should not be shared with anyone. They are how you authenticate to the Trusona services, and you should not check them into source control.

```js
const trusona = new Trusona(token, secret)
```

You'll also want to make sure the `token` and `secret` values aren't checked in to your project.


### Registering devices with Trusona

To get a device ready to be used with Trusona, there are three main steps:

1.  Create a device
1.  Bind the device to a user
1.  Activate the device

The first step, creating a device, will be handled by the Trusona mobile SDKs on the client. Once a device is created, the Trusona `deviceIdentifier` will need to be sent to your backend which can use the Trusona Server SDK to complete the next steps.


#### Binding a device to a user

When the backend determines which user owns the `deviceIdentifier`, it can bind the `userIdentifier` to the device in Trusona. The `userIdentifier` can be any `String` that allows you to uniquely identify the user in your system. To bind a device to a user, call the `createUserDevice` function.

```js
const userDevice = await trusona.createUserDevice(user.Id, "deviceIdentifier")
const userDevice.activationCode
```

More than one device can be bound to a user and later, when you Trusonafy them, any device bound to that user may accept the Trusonafication. Once the device is bound the user, you'll receive an activation code that can be used later to active the device.


##### Errors

|           Exception           |                                                                 Reason                                                                 |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `DeviceNotFoundError`     | Indicates that the request to bind the user to the device failed because the device could not be found.                                |
| `DeviceAlreadyBoundError` | Indicates that the request to bind the user to the device failed because the device is already bound to a different user.              |
| `ValidationError`         | Indicates that the request to bind the user to the device failed because either the `deviceIdentifier` or `userIdentifier` were blank. |
| `TrusonaError`            | Indicates that the request to bind the user to the device failed, check the message to determine the reason.                           |


#### Activating a device

When the device is ready to be activated, call the `activateUserDevice` function with the activation code.

```js
const result = await trusona.activateUserDevice(activationCode)
```

If the request is successful, the device is ready to be Trusonafied.

##### Exceptions

|         Exception         |                                                                     Reason                                                                      |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeviceNotFoundError` | Indicates that the request to activate the device failed because the device could not be found, most likely due to an invalid `activationCode`. |
| `ValidationError`     | Indicates that the request to activate the device failed because the `activationCode` was blank.                                                |
| `TrusonaError`        | Indicates that the request to activate the device failed, check the message to determine the reason.        

### Creating Trusonafications

Once a device is bound to a user, that user can be Trusonafied using the device identifier obtained from the Trusona Mobile SDK.

#### Creating an Essential Trusonafication

```js
const trusona = new Trusona(token, secret)

const trusonafication = Trusonafication.essential
        .deviceIdentifier("PBanKaajTmz_Cq1pDkrRzyeISBSBoGjExzp5r6-UjcI")
        .action("login")
        .resource("Acme Bank")
        .build() 

const result = await trusona.createTrusonafication(trusonafication)

if(result.IsSuccessful) {
  // handle successful authentication
}
```

By default, Essential Trusonafications are built such that the user's presence is required and a prompt asking the user to "Accept" or "Reject" the Trusonafication is presented by the Trusona Mobile SDK. A user's presence is determined by their ability to interact with the device's OS Security, usually by using a biometric or entering the device passcode.

#### Creating an Essential Trusonafication, without user presence or a prompt

```js
const trusona = new Trusona(token, secret)

const trusonafication = Trusonafication.essential
        .deviceIdentifier("PBanKaajTmz_Cq1pDkrRzyeISBSBoGjExzp5r6-UjcI")
        .action("login")
        .resource("Acme Bank")
        .withoutUserPresence()
        .withoutPrompt()
        .build() 

const result = await trusona.createTrusonafication(trusonafication)

if(result.IsSuccessful) {
  // handle successful authentication
}
```

In the above example, the addition of `withoutUserPresence()` and `withoutPrompt()` on the builder will result in a Trusonafication that can be accepted solely with possession of the device.

#### Creating an Essential Trusonafication, with a TruCode

```js
const trusona = new Trusona(token, secret)

const trusonafication = Trusonafication.essential
        .truCode("73CC202D-F866-4C72-9B43-9FCF5AF149BD")
        .action("login")
        .resource("Acme Bank")
        .build() 

const result = await trusona.createTrusonafication(trusonafication)

if(result.IsSuccessful) {
  // handle successful authentication
}
```

In this example, instead of specifying a device identifier, you can provide an ID for a TruCode that was scanned by the Trusona Mobile SDK. This will create a Trusonafication for the device that scanned the TruCode. See [Using TruCode for device discovery](#using-trucode-for-device-discovery) below for more information on using TruCodes.

#### Creating an Essential Trusonafication, with the user's identifier

```js
const trusona = new Trusona(token, secret)

const trusonafication = Trusonafication.essential
        .userIdentifier("73CC202D-F866-4C72-9B43-9FCF5AF149BD")
        .action("login")
        .resource("Acme Bank")
        .build() 

const result = await trusona.createTrusonafication(trusonafication)

if(result.IsSuccessful) {
  // handle successful authentication
}
```

In some cases you may already know the user's identifier (i.e. in a multi-factor or step-up authentication scenario). This example shows how to issue a Trusonafication using the user's identifier.

#### Creating an Essential Trusonafication, with the user's email

```js
const trusona = new Trusona(token, secret)

const trusonafication = Trusonafication.essential
        .emailAddress("user@domain.com")
        .action("login")
        .resource("Acme Bank")
        .build() 

const result = await trusona.createTrusonafication(trusonafication)

if(result.IsSuccessful) {
  // handle successful authentication
}
```

In some cases you may be able to send a Trusonafication to a user
by specifying their email address. This is the case if one of the following is true:

- You have verified ownership of a domain through the Trusona Developer's site
- You have an agreement with Trusona allowing you to send Trusonafications to any email address.

Creating a Trusonafication with an email address is similar to the other
use cases, except you use the `emailAddress()` function rather than `userIdentifier()` or `deviceIdentifier()`.

#### Creating an Executive Trusonafication

To create an Executive Trusonafication, call the `executive` function initially instead of `essential`.

```js
const trusona = new Trusona(token, secret)

const trusonafication = Trusonafication.executive
        .deviceIdentifier("PBanKaajTmz_Cq1pDkrRzyeISBSBoGjExzp5r6-UjcI")
        .action("login")
        .resource("Acme Bank")
        .build() 

const result = await trusona.createTrusonafication(trusonafication)

if(result.IsSuccessful) {
  // handle successful authentication
}
```

Executive Trusonafications require the user to scan an identity document to authenticate. An identity document needs to be registered with the user's account using the Trusona Mobile SDKs before the user can accept an Executive Trusonafication, and they must scan the same document they registered at the time of Trusonafication. Like Essential, both the prompt and user presence features can be used and are enabled by default, but they can be turned off independently by calling `withoutPrompt` or `withoutUserPresence`, respectively.
