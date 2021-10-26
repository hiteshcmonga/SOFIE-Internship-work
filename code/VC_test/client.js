// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require("esm")(module/* , options */)
module.exports = require("./main.js")

import { Ed25519VerificationKey2020 } from
  '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020, suiteContext } from '@digitalbazaar/ed25519-signature-2020';

const vc = require('@digitalbazaar/vc');
const fs = require('fs');

import { documentLoader } from './documentLoader.js';
const axios = require('axios');

async function verifyDeviceVC(){
var devicevc = await axios({url: "http://192.168.43.159/senddevicevc", method: "GET"});
devicevc = JSON.stringify(devicevc.data,null,2); 

var keyPair = fs.readFileSync("./ownerKeyPair.json");
keyPair = JSON.parse(keyPair);
keyPair = await Ed25519VerificationKey2020.from(keyPair);

const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })

//devicevc can't be read, check library.
const result = await vc.verifyCredential({ credential: devicevc, suite, documentLoader });
console.log(result);
}
verifyDeviceVC();


async function createPresentation(clientVC, clientKeyPair){
  
  var verifiableCredential= fs.readFileSync(clientVC);
  verifiableCredential= JSON.parse(verifiableCredential);
  const presentation = vc.createPresentation({verifiableCredential});
  const challenge="12345";
  var keyPair = fs.readFileSync(clientKeyPair);
  keyPair = JSON.parse(keyPair);
  keyPair = await Ed25519VerificationKey2020.from(keyPair);
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })
  const vp = await vc.signPresentation({presentation, suite, challenge, documentLoader});
  return vp;
}
// createPresentation("./clientcert.json","./ownerKeyPair.json");

// not yet tested
async function sendPresentation(postUrl, presentation){
  const sendVC = await axios.post(postUrl, presentation);
}


