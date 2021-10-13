// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require("esm")(module/* , options */)
module.exports = require("./main.js")

import { Ed25519VerificationKey2020 } from
  '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020, suiteContext } from '@digitalbazaar/ed25519-signature-2020';

const vc = require('@digitalbazaar/vc');

var jsonFile;

import {clientVC} from './owner.js'
import { documentLoader } from './documentLoader.js';

async function createPresentation(){
  const verifiableCredential= clientVC;
  const presentation = vc.createPresentation({verifiableCredential});
  const challenge="12345";
  const keyPair= await generateClientKeyPair();
  console.log(keyPair)
  const suite = new Ed25519Signature2020({ key: keyPair, verificationMethod: keyPair.id })// which keyPair will be used or do we need a new one here?
  const vp = await vc.signPresentation({presentation, suite, challenge, documentLoader});
  console.log(vp);
}
createPresentation();