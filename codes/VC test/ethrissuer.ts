import { VerifiableCredentialPayload, createVerifiableCredential } from 'did-jwt-vc'
import * as EthrDID from 'ethr-did'
import { Issuer } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

const issuer: Issuer = new EthrDID({
  address: '0xf1232f840f3ad7d23fcdaa84d6c66dac24efb198',
  privateKey: 'd8b595680851765f38ea5405129244ba3cbad84467d190859f4c8b20c1ff6c75'
})

//console.log(issuer)

const vcPayload: VerifiableCredentialPayload = {
    sub: 'did:ethr:0x435df3eda57154cf8cf7926079881f2912f54db4',
    nbf: 1562950282,
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
        degree: {
          type: 'BachelorDegree',
          name: 'Baccalauréat en musiques numériques'
        }
      }
    }
  }
  async function createVC() {
  const vcJwt = await createVerifiableCredential(vcPayload, issuer)
  console.log(vcJwt)}
  createVC()

  

