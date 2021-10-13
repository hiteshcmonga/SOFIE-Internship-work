// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require("esm")(module/* , options */)
module.exports = require("./main.js")

// for sending and receiving data from esp32 webserver
const axios = require('axios');
const fs = require('fs');

// signing 
import jsigs from 'jsonld-signatures';
const { purposes: { AssertionProofPurpose } } = jsigs;

// for issuing and verifying vc
import vc from '@digitalbazaar/vc';

import { Ed25519VerificationKey2020 } from
  '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020, suiteContext } from '@digitalbazaar/ed25519-signature-2020';

// didKey resolver
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();

// custom document loader
import { documentLoader } from './documentLoader.js';
import { generateKeyPair } from 'crypto';


var jsonFile;

//functionality to load KeyPair
async function loadKeyPair() {
  // Read Owner's keyPair stored in JSON file
  const serializedKeypair = fs.readFileSync(jsonFile);
  let cred = JSON.parse(serializedKeypair);
  // Import the keyPair from storage.
  const keyPair = await Ed25519VerificationKey2020.from(cred);
  // Create didKey from multibase PublicKey.
  let didKey = "did:key:" + keyPair.publicKeyMultibase;
  const StringdidKey = String(didKey);
  let assertionKey = didKey + "#" + keyPair.publicKeyMultibase;
  keyPair.id = assertionKey;
  keyPair.controller = didKey;
  return keyPair;
}

async function generateOwnerKeyPair() {
  jsonFile = 'ownerKeyPair.json'
  const keyPair = await loadKeyPair();
  return keyPair;
}

async function generateClientKeyPair() {
  jsonFile = 'clientKeyPair.json'
  const keyPair = await loadKeyPair();
  return keyPair;
}

// unsigned credential
var subId;
async function unsignedCred() {
  const issuer = await generateOwnerKeyPair();
  const date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var expireDate = new Date(year + 10, month, day);
  // RFC 3339 format
  const expirationDate = expireDate.toISOString();
  const issuanceDate = date.toISOString();

  const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "type": ["VerifiableCredential"],
    "issuanceDate": issuanceDate,
    "expirationDate": expirationDate,
    "issuer": issuer.controller,
    "credentialSubject": {
      "id": subId,
    }
  };
  
  let data=JSON.stringify(credential, null, 2);
  fs.writeFileSync("credential.json",data); /*if format needs to be changed or
                                            modification in VC is required*/
  /*after the program is compiled it stores client's DID as id, this id can be 
  added in the JSON as per required.  */
  return credential;
} unsignedCred();


async function generateDeviceVC() {
  // for fetching did from device
  const deviceDid = "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"; // Hard coded did for testing
  /*
   // for fetching did from device,
   // the await function does not handle errors and we can use timeout,
   // if we do not get did from device
   const did = await axios({
   url: "http://192.168.43.194/devicedid", 
   method: "GET"
 });
 const Devicedid = String(did.data); 
 */
  subId = deviceDid;
  const credential = await unsignedCred();
  const keyPair = await generateOwnerKeyPair();
  // Create verification suite
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })
  const signedVC = await vc.issue({ credential, suite, documentLoader });
  //const result = await vc.verifyCredential({ credential: signedVC, suite, documentLoader });
  //const sendVC = await axios.post('http://192.168.43.194/devicevc', signedVC);
  return signedVC;
} generateDeviceVC()


async function generateClientVC() {
  const keyPair = await generateOwnerKeyPair();
  const clientKeyPair = await generateClientKeyPair();
  subId = clientKeyPair.controller;
  const credential = await unsignedCred();
  //credential["URL"]= '/sensor1';
  //credential["methods"]= ["GET"];
  // the custom context for "type": "AllowedURLs" is required.
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })
  const signedVC = await vc.issue({ credential, suite, documentLoader });
  return signedVC;
}
generateClientVC();
export const clientVC = generateClientVC();

/*
Need to agree on library/ method for CLI arguments, but it will direct to following arguments:
1. Generate Owner KeyPair
2. Generate Client KeyPair
3. Generate Certificate for Device
4. Generate Certificate for Client:
4a) Specify URL
4b) Specify Method
(4a and 4b are optional)*/
