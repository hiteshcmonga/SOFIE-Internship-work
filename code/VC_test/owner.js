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
import { Ed25519Signature2020, suiteContext } from 
  '@digitalbazaar/ed25519-signature-2020';

// didKey resolver
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();

// custom document loader
import { documentLoader } from './documentLoader.js';

// generate owner keypair and store it into 'outputFile' provided by user
async function generateKeyPair(outputFile) {
  var keyPair = await Ed25519VerificationKey2020.generate();
  let didKey = "did:key:" + keyPair.publicKeyMultibase;
  let assertionKey = didKey + "#" + keyPair.publicKeyMultibase;
  keyPair.id = assertionKey;
  keyPair.controller = didKey;
  keyPair=JSON.stringify((keyPair),null,2);
  fs.writeFileSync(outputFile,keyPair);
} 

// unsigned credential
async function unsignedCred(did,keyPair) {
  //issuer can be changed
  var issuer= fs.readFileSync(keyPair);
  issuer= JSON.parse(issuer);
  const controller= issuer.controller;
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
    "issuer": controller,
    "credentialSubject": {
      "id": did,
    }
  };
  return credential;
} 


async function generateDeviceVC(ownerKeyPair){ //, deviceURL) {
  // Hard coded did for testing
  const deviceDid = "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"; 
  /*
   // for fetching did from device,
   // the await function does not handle errors and we can use timeout,
   // if we do not get did from device
   const did = await axios({
   url: deviceURL, 
   method: "GET"
 });
 const Devicedid = String(did.data); 
 */
  const credential = await unsignedCred(deviceDid,ownerKeyPair);
   // Import the keyPair from storage.
  var keyPair = fs.readFileSync(ownerKeyPair);
  keyPair = JSON.parse(keyPair);
  // Load keyPair in Ed25519VerificationKey2020 format 
  keyPair = await Ed25519VerificationKey2020.from(keyPair);
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })
  const signedVC = await vc.issue({ credential, suite, documentLoader });
  //const result = await vc.verifyCredential({ credential: signedVC, suite, documentLoader });
  //const sendVC = await axios.post('http://192.168.43.194/devicevc', signedVC);
 return signedVC;
} //generateDeviceVC('./ownerKeyPair.json')

async function generateClientVC(ownerKeyPair,clientDid, outputFile){
  const credential= await unsignedCred(clientDid,ownerKeyPair);
  var keyPair = fs.readFileSync(ownerKeyPair);
  keyPair = JSON.parse(keyPair);
  keyPair = await Ed25519VerificationKey2020.from(keyPair);
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })
  const signedVC = JSON.stringify(await vc.issue({ credential, suite, documentLoader }),null,2);
  fs.writeFileSync(outputFile,signedVC);
  return signedVC;
}


/*provide first argument as the functionality that needs to be processed,
and following arguments as parameters required*/
async function cli(){
var Args= process.argv;
var option = process.argv.slice(2,3);
console.log('myArgs: ', option);
console.log('Choose functionality:',
'\n', '[1]. Generate KeyPair, parameter : ownerKeyPair','\n',
//device's URL is static for testing.
'[2]. Generate Device VC, parameters : ownerKeyPair File,device URL',
'\n','[3]. Generate Client VC, parameters : keyPair File, clientDid, outputFile',
'\n');

if(option=='genKeyPair'){
  //example input: node -r esm owner.js genKeyPair ownerKeyPair.json
  var keyPair= await generateKeyPair(Args[3]);
  keyPair= JSON.parse(fs.readFileSync(Args[3]));
  console.log('Generated KeyPair is:','\n',keyPair);
}
else if(option=='genDeviceVC'){
  //example input: node -r esm owner.js genDeviceVC ownerKeyPair.json
  var VC= await generateDeviceVC(Args[3]);
  console.log('Generated DeviceVC is:','\n',VC);
}
//instead of '3'
else if(option=='genClientVC'){
  // example:
  // node -r esm owner.js genClientVC ownerKeyPair.json did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP clientcert.json
  var VC= await generateClientVC(Args[3],Args[4],Args[5]);
  console.log('Generated Client VC is:','\n',VC);
}

}
cli();
