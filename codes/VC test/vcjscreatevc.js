"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var did_resolver_1 = require("did-resolver");
var nacl_did_1 = require("nacl-did");
var nacl_did_2 = require("nacl-did");
var id = nacl_did_2.createIdentity().did;
var didResolver = new did_resolver_1.Resolver({ nacl: nacl_did_1.resolver });
didResolver.resolve(id).then(function (doc) { return console.log; });
//resolver function for did did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI
function resolve() {
    return __awaiter(this, void 0, void 0, function () {
        var controller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, didResolver.resolve(id)
                    //console.log(doc)} 
                ];
                case 1:
                    controller = _a.sent();
                    //console.log(doc)} 
                    return [2 /*return*/, controller];
            }
        });
    });
}
resolve();
//const id= 'did:nacl:Md8JiMIwsapml_FtQ2ngnGftNP5UmVCAUuhnLyAsPxI'
//function for generating suite using id and controller document as parameters
function gensuite() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, Ed25519KeyPair, Ed25519Signature2018, controller, keyPair, suite;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = require('jsonld-signatures'), Ed25519KeyPair = _a.Ed25519KeyPair, Ed25519Signature2018 = _a.suites.Ed25519Signature2018;
                    return [4 /*yield*/, resolve()];
                case 1:
                    controller = _b.sent();
                    return [4 /*yield*/, Ed25519KeyPair.generate()];
                case 2:
                    keyPair = _b.sent();
                    keyPair.id = id;
                    keyPair.controller = controller;
                    suite = new Ed25519Signature2018({
                        verificationMethod: keyPair.id,
                        key: keyPair
                    });
                    return [2 /*return*/, suite];
            }
        });
    });
}
gensuite();
//function to create vc with credentials(defined in-function) and suite as parameters
function createvc() {
    return __awaiter(this, void 0, void 0, function () {
        var vc, suite, credential, signedVC;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vc = require('vc-js');
                    return [4 /*yield*/, gensuite()
                        // Sample unsigned credential
                    ];
                case 1:
                    suite = _a.sent();
                    credential = {
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
                    return [4 /*yield*/, vc.issue({ credential: credential, suite: suite })];
                case 2:
                    signedVC = _a.sent();
                    console.log(signedVC);
                    return [2 /*return*/];
            }
        });
    });
}
createvc();
