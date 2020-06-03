import { Resolver } from 'did-resolver';
import { resolver as naclDidResolver } from 'nacl-did';
const didResolver = new Resolver({ nacl: naclDidResolver });
didResolver.resolve('did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI').then(doc => console.log);
// You can also use ES7 async/await syntax
const doc = await didResolver.resolve('did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI');
