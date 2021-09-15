const vc = require('vc-js');
const axios= require ('axios');
const {extendContextLoader} = require('jsonld-signatures');
const v1 = require('./contexts/v1.json');
const v1ex= require('./contexts/v1example.json');
const odrl= require('./contexts/odrl.json');
import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;


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

   //this is used for resolved the Nacl DID.
   /*if(url.startsWith('did:self:')) {
       const controller = await didResolver.resolve(url)
       return {
         contextUrl: null,
         documentUrl: url,
         document: controller
       }
     }*/
   throw new Error('No custom context support for ' + url);   
});


async function getDevicedid(){
    const deviceDid = await axios ({
        url: "http://192.168.43.159/devicedid",
        method: "GET"});
        const did=String(deviceDid.data);
        //console.log(did);
        return did;
}
getDevicedid();

async function deviceVC(){
    const keyPair = await Ed25519VerificationKey2020.generate();
    const deviceDid= await getDevicedid();
    const suite = new Ed25519Signature2020({key: keyPair, 
        purpose: new AssertionProofPurpose(),
        verificationMethod:"DID:METHOD HERE"});
    console.log(suite.purpose);
    //unsigned credential
    const credential={
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
          ],
      
          "type": ["VerifiableCredential"],
          "issuanceDate": "2010-01-01T19:23:24Z",
          "issuer": {
              "id": "did:self:owner",//replace this hard coded did by auto-generated did.
              "name": "owner"
             },
            "credentialSubject": {
          "id": deviceDid, //Devicedid
          "name": "device1"
          }
        };
    const signedVC = await vc.issue({credential, suite,documentLoader});
    console.log(JSON.stringify(signedVC, null, 2));
} deviceVC()
