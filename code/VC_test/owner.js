// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require("esm")(module/* , options */)
module.exports = require("./main.js")

// contexts required
const v1 = require('./contexts/v1.json');
const v1ex = require('./contexts/v1example.json');
const odrl = require('./contexts/odrl.json');
const ed25519v1 = require('./contexts/ed25519-signature-2020-v1.json')

// for sending and receiving data from esp32 webserver
const axios = require('axios');

const fs = require('fs');

// signing 
import jsigs from 'jsonld-signatures';
const { purposes: { AssertionProofPurpose } } = jsigs;

// for issuing and verifying vc
import vc from '@digitalbazaar/vc';
const { extendContextLoader } = require('jsonld-signatures');

import { Ed25519VerificationKey2020 } from
  '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020, suiteContext } from '@digitalbazaar/ed25519-signature-2020';

// didKey resolver
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();

// custom document Loader according to the required contexts

const documentLoader = extendContextLoader(async url => {
  //console.log("Looking for " + url)  //to check the documents required.
  /* this document contains varioud contexts and definations 
   related to Verifiable Credentials(VC), Verifiable Presentation (VP) 
  and information about various signature types */

  if (url == 'https://www.w3.org/2018/credentials/v1') {
    return {
      contextUrl: null,
      documentUrl: url,
      /* this did key's context should resolve
       to the latest did-context*/
      document: v1
    };
  }

  /* this document contains example/format of a verifiable credential(academic)
  , user can change the parameters according to need and
   the doc is linked with odrl file as well. */
  if (url == 'https://www.w3.org/2018/credentials/examples/v1') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: v1ex
    };
  }
  // this is required to resolve the suite context 
  if (url == 'https://w3id.org/security/suites/ed25519-2020/v1') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: ed25519v1
    };
  }

  /* this custom context is required for running the above url,
   this provides info about usage of content and services.*/
  if (url == 'https://www.w3.org/ns/odrl.jsonld') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: odrl
    };
  }


  // did key resolving
  if (url.startsWith('did:key') || url.includes('#')) {
    const did = url.split('#')[0];
    const controller = await didKeyDriver.get({ did });
    return {
      contextUrl: null,
      documentUrl: url,
      document: controller
    }
  }

  throw new Error('No custom context support for ' + url);
});

async function sendDeviceVC() {
  const Devicedid ="did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"; 
  // Read Owner's keyPair stored in JSON file
  const serializedKeypair = fs.readFileSync('ownerKeyPair.json');
  let ownerCred = JSON.parse(serializedKeypair);
  // Import the keyPair from storage.
  const keyPair = await Ed25519VerificationKey2020.from(ownerCred);
  // Create didKey from multibase PublicKey.
  let didKey = "did:key:" + keyPair.publicKeyMultibase;
  const StringdidKey = String(didKey);
  let assertionKey = didKey + "#" + keyPair.publicKeyMultibase;
  keyPair.id = assertionKey;
  keyPair.controller = didKey;

  // Create verification suite
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })

  const date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var expireDate = new Date(year + 10, month, day);
  
  //RFC 3339 format
  const expirationDate= expireDate.toISOString();
  const issuanceDate = date.toISOString();

  // unsigned credential
  const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],

    "type": ["VerifiableCredential"],
    "issuanceDate": issuanceDate,
    "expirationDate": expirationDate,
    "issuer": keyPair.controller,
    "credentialSubject": {
      "id": Devicedid, // Devicedid
    }
  };
  
  // Create Signed VC
  const signedVC = await vc.issue({ credential, suite, documentLoader });
  const result = await vc.verifyCredential({ credential: signedVC, suite, documentLoader });
  //console.log(JSON.stringify(result, null, 2));
  const sendVC = await axios.post('http://192.168.43.194/devicevc',signedVC);
} sendDeviceVC()
