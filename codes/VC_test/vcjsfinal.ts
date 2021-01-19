var fs = require("fs");
const {extendContextLoader} = require('jsonld-signatures');
const vc = require('vc-js');
//const myCustomContext = require('./myCustomContext');

//loading custom contexts, these are saved in a seperate folder of 'contexts' in the repo itself
const v1 = require('./contexts/v1.json');
const v1ex= require('./contexts/v1example.json');
const odrl= require('./contexts/odrl.json'); 
//const didv1= require('./contexts/did-v1.json'); not required anymore

import { Resolver } from 'did-resolver'
import { resolver as naclDidResolver } from 'nacl-did'
import { createIdentity, loadIdentity } from 'nacl-did'
const didResolver = new Resolver({ nacl: naclDidResolver })

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
      if(url.startsWith('did:nacl:')) {
          const controller = await didResolver.resolve(url)
          return {
            contextUrl: null,
            documentUrl: url,
            document: controller
          }
        }
      throw new Error('No custom context support for ' + url);   
  });



//subject creation
const subjectid= createIdentity().did
async function subject() 
{const sdoc = await didResolver.resolve(subjectid)
const subject = {
    '@context': [
     "https://w3id.org/did/v1",
    ],
    id:subjectid,
    publicKey:sdoc.publicKey
};
return subject          
}
subject() 


//the subject suite for signing VP
//the function which creates and verifies our customised credentials and presentations
async function credentials(){  
  const sdoc = await didResolver.resolve(subjectid)
  //fetches id issued by owner 
  const fetch = require("node-fetch");
  let response = await fetch('http://192.168.43.159');
  let data=await response.text()
  //issuer id is resolved here
  const idoc= await didResolver.resolve(data)
  const sub=await subject()

  const issuer = {
  '@context': [
   "https://w3id.org/did/v1",
   sub
  ],
  id:idoc.id,
  publicKey:idoc.publicKey,
  assertionMethod:idoc.id,
  authentication:sdoc.id
};  

const iss= issuer
const {Ed25519KeyPair, suites: {Ed25519Signature2018}} = require('jsonld-signatures');
const keyPair = await Ed25519KeyPair.generate();
//const idoc = await didResolver.resolve(idoc.id)
keyPair.id = iss.assertionMethod
keyPair.controller = idoc
    
    const isssuite = new Ed25519Signature2018({
      verificationMethod: keyPair.id,
      key: keyPair
    });
   // console.log(JSON.stringify(isssuite,null,2))
//const idoc = await didResolver.resolve(issuerid)
const issuercontroller= issuer 


//subject suite , which is used for presentation as well as for verifying client's credential over ESP32

//const {Ed25519KeyPair, suites: {Ed25519Signature2018}} = require('jsonld-signatures');
  const keyPairsub = await Ed25519KeyPair.generate();
  const {sign}=keyPairsub.signer();
  //console.log(signatureValue);
  keyPairsub.id = sub.id
  keyPairsub.controller = sdoc
  const subsuite = new Ed25519Signature2018({
      verificationMethod: keyPairsub.id,
      key: keyPairsub
    });
    console.log(JSON.stringify(subsuite,null,2))


const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],

    "type": ["VerifiableCredential", "IoTAccessRightsCredential"],
    "issuanceDate": "2010-01-01T19:23:24Z",
    "issuer": {
        "id": idoc.id,
        "name": "Device"
       },
       
      "credentialSubject": {
    "id": sdoc.id, // different public key
    },   
  };

  //certificate issued from owner explaining the rights client has, this certificate is verified by device along with the publicKeys of client to verify whether client is trust worthy or not 
  const oid= createIdentity().did
  const oid1= createIdentity().did
  //the certificate that will be sent to device for verification
  const ownercert={
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],

    "type": ["VerifiableCredential", "IoTAccessRightsCredential"],
    "issuanceDate": "2010-01-01T19:23:24Z",
    "issuer": {
        "id": oid,
        "name": "Owner"
       },
       
      "credentialSubject": {
    "id": oid1, // different public key
    "accessRights": ["read" , "write"] 
    },  
    "Publickeyowner":"fc97e71f25c7f49d7d21553596a68b4255a9d2d8bcc00ee973c7ba549892f24b", //publickeyowner is verification of public key obtained from owner
    "PublicKeyclient": "475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e" //publickeyclient is for client verification ,while the rest of the certificate is for verification of the certificate obtained from owner by client,here there is base58 to hex conversion of base58keyPair  
  };
  const jsonownercert=JSON.stringify(ownercert)
  console.log(jsonownercert)

    const issuer_suite= isssuite
    const subject_suite= subsuite
    const signedVC = await vc.issue({credential, suite:issuer_suite});
    //console.log(JSON.stringify(signedVC, null, 2));
    const vcresult = await vc.verifyCredential({credential:signedVC, documentLoader, suite:issuer_suite, controller:issuercontroller});
    //console.log(JSON.stringify(vcresult, null, 2));

    if(vcresult.verified==true){
    //now if the credential of ESP32 are verified by client the client will post its credentials over ESP32 webserver to get them verified
    console.log('DEVICE CREDENTIAL VERIFIED, now sending Client Credentials..... \n',JSON.stringify(vcresult, null, 2))
    const axios = require('axios');
    axios.post('http://192.168.43.159/', {ownercert}); //once device is verified, client sends its certificate for verification
  }
    
    else console.log('CREDENTIAL NOT VERIFIED')


    //const verifiableCredential = [signedVC];
    //const presentation = vc.createPresentation({verifiableCredential}); //unsigned presentation
    //const challenge = "1f44d55f-f161-4938-a659-f8026467f126"
    //const domain = "4jt78h47fh47"

    //creating the signed presentation
    //const vp = await vc.signPresentation({presentation, suite:subject_suite, challenge,domain});
    //console.log(JSON.stringify(vp, null, 2))
    //const vpresult = await vc.verify({presentation:vp, documentLoader, challenge,domain, suite:[issuer_suite, subject_suite], controller:issuercontroller});
    //if(vpresult.verified==true) console.log('PRESENTATION VERIFIED \n',JSON.stringify(vpresult, null, 2))
    //console.log(JSON.stringify(vpresult, null, 2)) 
    //else console.log('PRESENTATION NOT VERIFIED')
}
credentials()
