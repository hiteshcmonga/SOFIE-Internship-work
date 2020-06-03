import { Resolver } from 'did-resolver'
import { resolver as naclDidResolver } from 'nacl-did'
import { createIdentity, loadIdentity } from 'nacl-did'

const identity = createIdentity()
//console.log(identity)
const didResolver = new Resolver({ nacl: naclDidResolver })
didResolver.resolve('did:nacl:sDSjO0UmzfJA_xjbRxfJug1rY7oPYICvV2m4aO2RUSk').then(doc => console.log)

// You can also use ES7 async/await syntax
async function f()
{const doc = await didResolver.resolve('did:nacl:sDSjO0UmzfJA_xjbRxfJug1rY7oPYICvV2m4aO2RUSk')
console.log(doc)
}
f()

const vc = require('vc-js');

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
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "alumniOf": "Example University"
  }
};
async function issue(){
const signedVC = await vc.issue({credential, didResolver});
console.log(JSON.stringify(signedVC, null, 2));}
issue()