import { Resolver } from 'did-resolver'
import { resolver as naclDidResolver } from 'nacl-did'
import { createIdentity, loadIdentity } from 'nacl-did'

const id = createIdentity().did
const didResolver = new Resolver({ nacl: naclDidResolver })
didResolver.resolve(id).then(doc => console.log)

//resolver function for did did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI
async function resolve() {
const controller = await didResolver.resolve(id)
//console.log(doc)} 
return controller
}
resolve()

//const id= 'did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI'

//function for generating suite using id and controller document as parameters
async function gensuite(){
const {Ed25519KeyPair, suites: {Ed25519Signature2018}} = require('jsonld-signatures');
const controller = await resolve()
const keyPair = await Ed25519KeyPair.generate();
keyPair.id = id;
keyPair.controller = controller;

const suite = new Ed25519Signature2018({
  verificationMethod: keyPair.id,
  key: keyPair
});
return suite
console.log(suite) 
//console.log(keypair)
}
gensuite()


//function to create vc with credentials(defined in-function) and suite as parameters
async function createvc ()
{
    const vc = require('vc-js');
    const suite= await gensuite()
    // Sample unsigned credential
    const credential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "id": "https://example.com/credentials/1872",
      "type": ["VerifiableCredential", "AlumniCredential"],
      "issuer": "https://example.edu/issuers/565049",
      "issuanceDate": "2010-01-01T19:23:24Z",
      "credentialSubject": {
        "id": id,
        "alumniOf": "Example University"
      }
    };
    
    const signedVC = await vc.issue({credential, suite});
    console.log(signedVC);
}
createvc() 
