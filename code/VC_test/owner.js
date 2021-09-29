// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require("esm")(module/* , options */)
module.exports = require("./main.js")

//contexts required
const v1 = require('./contexts/v1.json');
const v1ex= require('./contexts/v1example.json');
const odrl= require('./contexts/odrl.json');
const ed25519v1= require('./contexts/ed25519-signature-2020-v1.json')

//for sending and receiving data from esp32 webserver
const axios= require ('axios');

//signing 
import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;

//for issuing and verifying vc
import vc from '@digitalbazaar/vc';
const {extendContextLoader} = require('jsonld-signatures');

import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020, suiteContext} from '@digitalbazaar/ed25519-signature-2020';

const didKeyDriver = require('@digitalbazaar/did-method-key').driver();

//custom document Loader according to the required contexts
const documentLoader = extendContextLoader(async url => {
    console.log("Looking for " + url)  //to check the documents required.
    //this document contains varioud contexts and definations related to Verifiable Credentials(VC), Verifiable Presentation (VP) and information about various signature types
    if(url=='https://www.w3.org/2018/credentials/v1') {
     return {
       contextUrl: null,
       documentUrl: url,
       // this did key's context should resolve
       // to the latest did-context
       document: v1
     };
    }

    // this document contains example/format of a verifiable credential(academic), user can change the parameters according to need and the doc is linked with odrl file as well. 
     if(url=='https://www.w3.org/2018/credentials/examples/v1') {
       return {
         contextUrl: null,
         documentUrl: url,
         // this did key's context should resolve
         // to the latest did-context
         document: v1ex
       }; 
   }     
   //this is required to resolve the suite context 
   if(url=='https://w3id.org/security/suites/ed25519-2020/v1') {
       return {
         contextUrl: null,
         documentUrl: url,
         // this did key's context should resolve
         // to the latest did-context
         document: ed25519v1
       }; 
   }   

   // this custom context is required for running the above url, this provides info about usage of content and services.
   if(url=='https://www.w3.org/ns/odrl.jsonld') {
    return {
      contextUrl: null,
      documentUrl: url,
      // this did key's context should resolve
      // to the latest did-context
      document: odrl
    }; 
  } 

   //did key resolving

     if(url.startsWith('did:key') && url.includes('#')) {
        const did = url.split('#')[0];
        const didKey = await didKeyDriver.get({did});
        let doc = null;
        for(const prop in didKey) {
          const property = didKey[prop];
          if(Array.isArray(property)) {
            [doc] = property.filter(p => p.id === url);
          }
          if(property.id === url) {
            doc = didKey[prop];
          }
          if(doc) {
            break;
          }
        }
    }
   throw new Error('No custom context support for ' + url);   
});


async function sendDeviceVC(){
    const deviceDid = await axios ({
        url: "http://192.168.43.194/devicedid",
        method: "GET"});
    const did=String(deviceDid.data);
    const didDocument = await didKeyDriver.get({did})
    const keyPair = await Ed25519VerificationKey2020.generate(); //this needs to be a static one, tried this only for testing.
    keyPair.id=didDocument.verificationMethod
    keyPair.controller=didDocument
    console.log(keyPair.id)
    const suite = new Ed25519Signature2020({key: keyPair, verificationMethod:keyPair.id})
    
    //unsigned credential
    const credential={
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1"
          ],
      
          "type": ["VerifiableCredential"],
          "issuanceDate": "2012-01-01T19:23:24Z",
          "expirationDate": "2022-01-01T19:23:24Z",
           "issuer":"did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T", //owner's did , can be kept any did key here , as for VerificationMethod only credentialSubject.id matters here
            "credentialSubject": {
          "id": didDocument.id, //Devicedid
          }
        };
        const signedVC = await vc.issue({credential, suite, documentLoader});
        JSON.stringify(signedVC, null, 2);
        console.log(signedVC);
        
        /*const result= await vc.verifyCredential({credential: signedVC, suite, documentLoader});
        console.log(JSON.stringify(result, null, 2));*/

       /* const postDid = await axios ({
            method: 'POST',
            data: signedVC,
            url:"http://192.168.43.194/devicevc",
          });    */
          
} sendDeviceVC()
