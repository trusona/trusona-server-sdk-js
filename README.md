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
      1. [Creating a Trusonafication for a Managed Trusona User](#creating-a-trusonafication-for-a-managed-trusona-user)
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
