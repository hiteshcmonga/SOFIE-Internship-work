const axios= require('axios');
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();

//To GET device's DID.
async function getDeviceDid(){
    const deviceDid = await axios ({
        url: "http://192.168.43.159/devicedid",
        method: "GET"});
        const did=String(deviceDid.data);
        console.log(did);
        /*const didDocument = await didKeyDriver.get({did});
        console.log(didDocument); */
}
getDeviceDid();

   // If hardware device is not available, these did ,which were generated from device side can be used for checking the same function mentioned above.
async function deviceTestDid(){
    const did = 'did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy51T';
   // 'did:key:z6Mk93oCiM5ezNfC7uU88dutcmzmGbaMaued1w7bdHK6VW36';  
    //'did:key:z6MkEcBi4zUpbNz4SXvzXUVZRouYNUhVBqiSkLKhxLxbFFGv'
const didDocument = await didKeyDriver.get({did});
console.log(didDocument);
}
deviceTestDid();