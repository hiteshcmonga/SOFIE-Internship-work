// contexts required

require = require("esm")(module/* , options */)
module.exports = require("./main.js")

const v1 = require('./contexts/v1.json');
const v1ex = require('./contexts/v1example.json');
const odrl = require('./contexts/odrl.json');
const ed25519v1 = require('./contexts/ed25519-signature-2020-v1.json')

const { extendContextLoader } = require('jsonld-signatures');

// custom document Loader according to the required contexts

const documentLoader = extendContextLoader(async url => {
    //console.log("Looking for " + url)  //to check the documents required.
    /* this document contains varioud contexts and definations 
     related to Verifiable Credentials(VC), Verifiable Presentation (VP) 
    and information about various signature types */
  
    if (url == 'https://www.w3.org/2018/credentials/v1') {
      return {
        contextUrl: null,
        documentUrl: url,
        /* this did key's context should resolve
         to the latest did-context*/
        document: v1
      };
    }
  
    /* this document contains example/format of a verifiable credential(academic)
    , user can change the parameters according to need and
     the doc is linked with odrl file as well. */
    if (url == 'https://www.w3.org/2018/credentials/examples/v1') {
      return {
        contextUrl: null,
        documentUrl: url,
        document: v1ex
      };
    }
    // this is required to resolve the suite context 
    if (url == 'https://w3id.org/security/suites/ed25519-2020/v1') {
      return {
        contextUrl: null,
        documentUrl: url,
        document: ed25519v1
      };
    }
  
    /* this custom context is required for running the above url,
     this provides info about usage of content and services.*/
    if (url == 'https://www.w3.org/ns/odrl.jsonld') {
      return {
        contextUrl: null,
        documentUrl: url,
        document: odrl
      };
    }
  
  
    // did key resolving
    if (url.startsWith('did:key') || url.includes('#')) {
      const did = url.split('#')[0];
      const controller = await didKeyDriver.get({ did });
      return {
        contextUrl: null,
        documentUrl: url,
        document: controller
      }
    }
  
    throw new Error('No custom context support for ' + url);
  });
  
  export {documentLoader};