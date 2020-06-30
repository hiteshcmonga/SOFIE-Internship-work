var fs = require("fs");
const {extendContextLoader} = require('jsonld-signatures');
const vc = require('vc-js');
//const myCustomContext = require('./myCustomContext');
const v1 = require('./contexts/v1.json');
const v1ex= require('./contexts/v1example.json');
const odrl= require('./contexts/odrl.json'); 
const didv1= require('./contexts/did-v1.json');

import { Resolver } from 'did-resolver'
import { resolver as naclDidResolver } from 'nacl-did'
import { createIdentity, loadIdentity } from 'nacl-did'
const didResolver = new Resolver({ nacl: naclDidResolver })

//nacl ids of issuer and subject
const issuerid = createIdentity().did
const subjectid= createIdentity().did

//custom document Loader according to the required contexts

const documentLoader = extendContextLoader(async url => {
       console.log("Looking for " + url)
       if(url=='https://www.w3.org/2018/credentials/v1') {
        return {
          contextUrl: null,
          documentUrl: url,
          // this did key's context should resolve
          // to the latest did-context
          document: v1
          
        };
       }
        if(url=='https://www.w3.org/2018/credentials/examples/v1') {
          return {
            contextUrl: null,
            documentUrl: url,
            // this did key's context should resolve
            // to the latest did-context
            document: v1ex
          }; 
      }     
  
      if(url=='https://www.w3.org/ns/odrl.jsonld') {
          return {
            contextUrl: null,
            documentUrl: url,
            // this did key's context should resolve
            // to the latest did-context
            document: odrl
          }; 
        }
  
  
       if(url=='https://w3id.org/did/v1') {
          return {
            contextUrl: null,
            documentUrl: url,
            // this did key's context should resolve
            // to the latest did-context
            document: didv1
          }; 
        }  
      

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

//customised subject document
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

//customised issuer function, since the nacl document does not have assertionmethod for verification
async function issuer() 
{   
    const sdoc = await didResolver.resolve(subjectid)
    const idoc = await didResolver.resolve(issuerid)
    const sub=await subject()
  const issuer = {
    '@context': [
     "https://w3id.org/did/v1",
     sub
    ],
    id:issuerid,
    publicKey:idoc.publicKey,
    assertionMethod:idoc.id,
    authentication:sdoc.id
  };  
return issuer    
}
issuer()

//the issuer suite for signing VC      
async function issuersuite(){
const iss= await issuer()    
const {Ed25519KeyPair, suites: {Ed25519Signature2018}} = require('jsonld-signatures');
const keyPair = await Ed25519KeyPair.generate();
const idoc = await didResolver.resolve(issuerid)
keyPair.id = iss.assertionMethod
keyPair.controller = idoc
    
    const suite = new Ed25519Signature2018({
      verificationMethod: keyPair.id,
      key: keyPair
    });
   // console.log(JSON.stringify(suite, null, 2));
return suite    
}
issuersuite()

//the subject suite for signing VP
async function subjectsuite(){
const sub= await subject()
const sdoc = await didResolver.resolve(subjectid)
const {Ed25519KeyPair, suites: {Ed25519Signature2018}} = require('jsonld-signatures');
const keyPair = await Ed25519KeyPair.generate();
keyPair.id = sub.id
keyPair.controller = sdoc
const suite = new Ed25519Signature2018({
    verificationMethod: keyPair.id,
    key: keyPair
  });
  return suite    
}
subjectsuite()


//the function which creates and verifies our customised credentials and presentations
async function credentials(){  
const sdoc = await didResolver.resolve(subjectid)
const idoc = await didResolver.resolve(issuerid)
const issuercontroller= await issuer()   
const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],

    "type": ["VerifiableCredential", "IoTAccessRightsCredential"],
    "issuanceDate": "2010-01-01T19:23:24Z",
    "issuer": {
        "id": idoc.id,
        "name": "Owner"
       },
       
      "credentialSubject": {
    "id": sdoc.id, // different public key
    //"accessRights": ["read" , "write"] //ask for the context of this property
    },   
    
  };
    const issuer_suite= await issuersuite()
    const subject_suite= await subjectsuite()
    const signedVC = await vc.issue({credential, suite:issuer_suite});
    console.log(JSON.stringify(signedVC, null, 2));
    const vcresult = await vc.verifyCredential({credential:signedVC, documentLoader, suite:issuer_suite, controller:issuercontroller});
    console.log(JSON.stringify(vcresult, null, 2));
    const verifiableCredential = [signedVC];
    const presentation = vc.createPresentation({verifiableCredential});
    const challenge = "1f44d55f-f161-4938-a659-f8026467f126"
    const domain = "4jt78h47fh47"
    const vp = await vc.signPresentation({presentation, suite:subject_suite, challenge,domain});
    console.log(JSON.stringify(vp, null, 2))
    const vpresult = await vc.verify({presentation:vp, documentLoader, challenge,domain, suite:[issuer_suite, subject_suite], controller:issuercontroller});
    console.log(JSON.stringify(vpresult, null, 2)) 
}
credentials()
