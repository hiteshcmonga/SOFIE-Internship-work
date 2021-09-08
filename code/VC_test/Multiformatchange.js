const multicodec = require('multicodec')
var uint8array = new TextEncoder("utf-8").encode("HLG6lNaQebgoP73DUEVptln1SKE0uU9p");
const prefixedProtobuf = multicodec.addPrefix('ed25519-pub',uint8array );

const multibase = require('multibase')
const bytes = multibase.encode('base58btc',prefixedProtobuf);
var string = new TextDecoder().decode(bytes);
console.log(string);
