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
var fs = require("fs");
var extendContextLoader = require('jsonld-signatures').extendContextLoader;
var vc = require('vc-js');
//const myCustomContext = require('./myCustomContext');
var v1 = require('./contexts/v1.json');
var v1ex = require('./contexts/v1example.json');
var odrl = require('./contexts/odrl.json');
var didv1 = require('./contexts/did-v1.json');
var did_resolver_1 = require("did-resolver");
var nacl_did_1 = require("nacl-did");
var nacl_did_2 = require("nacl-did");
var didResolver = new did_resolver_1.Resolver({ nacl: nacl_did_1.resolver });
//custom document Loader according to the required contexts
var documentLoader = extendContextLoader(function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var controller;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Looking for " + url);
                if (url == 'https://www.w3.org/2018/credentials/v1') {
                    return [2 /*return*/, {
                            contextUrl: null,
                            documentUrl: url,
                            // this did key's context should resolve
                            // to the latest did-context
                            document: v1
                        }];
                }
                if (url == 'https://www.w3.org/2018/credentials/examples/v1') {
                    return [2 /*return*/, {
                            contextUrl: null,
                            documentUrl: url,
                            // this did key's context should resolve
                            // to the latest did-context
                            document: v1ex
                        }];
                }
                if (url == 'https://www.w3.org/ns/odrl.jsonld') {
                    return [2 /*return*/, {
                            contextUrl: null,
                            documentUrl: url,
                            // this did key's context should resolve
                            // to the latest did-context
                            document: odrl
                        }];
                }
                if (url == 'https://w3id.org/did/v1') {
                    return [2 /*return*/, {
                            contextUrl: null,
                            documentUrl: url,
                            // this did key's context should resolve
                            // to the latest did-context
                            document: didv1
                        }];
                }
                if (!url.startsWith('did:nacl:')) return [3 /*break*/, 2];
                return [4 /*yield*/, didResolver.resolve(url)];
            case 1:
                controller = _a.sent();
                return [2 /*return*/, {
                        contextUrl: null,
                        documentUrl: url,
                        document: controller
                    }];
            case 2: throw new Error('No custom context support for ' + url);
        }
    });
}); });
var subjectid = nacl_did_2.createIdentity().did;
function subject() {
    return __awaiter(this, void 0, void 0, function () {
        var sdoc, subject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, didResolver.resolve(subjectid)];
                case 1:
                    sdoc = _a.sent();
                    subject = {
                        '@context': [
                            "https://w3id.org/did/v1",
                        ],
                        id: subjectid,
                        publicKey: sdoc.publicKey
                    };
                    return [2 /*return*/, subject];
            }
        });
    });
}
subject();
//the subject suite for signing VP
function subjectsuite() {
    return __awaiter(this, void 0, void 0, function () {
        var sub, sdoc, _a, Ed25519KeyPair, Ed25519Signature2018, keyPair, suite;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, subject()];
                case 1:
                    sub = _b.sent();
                    return [4 /*yield*/, didResolver.resolve(subjectid)];
                case 2:
                    sdoc = _b.sent();
                    _a = require('jsonld-signatures'), Ed25519KeyPair = _a.Ed25519KeyPair, Ed25519Signature2018 = _a.suites.Ed25519Signature2018;
                    return [4 /*yield*/, Ed25519KeyPair.generate()];
                case 3:
                    keyPair = _b.sent();
                    keyPair.id = sub.id;
                    keyPair.controller = sdoc;
                    suite = new Ed25519Signature2018({
                        verificationMethod: keyPair.id,
                        key: keyPair
                    });
                    return [2 /*return*/, suite];
            }
        });
    });
}
subjectsuite();
//the function which creates and verifies our customised credentials and presentations
function credentials() {
    return __awaiter(this, void 0, void 0, function () {
        var sdoc, fetch, response, data, idoc, sub, issuer, iss, _a, Ed25519KeyPair, Ed25519Signature2018, keyPair, suite, issuercontroller, credential, issuer_suite, subject_suite, signedVC, vcresult, verifiableCredential, presentation, challenge, domain, vp, vpresult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, didResolver.resolve(subjectid)
                    //fetches id issued by owner 
                ];
                case 1:
                    sdoc = _b.sent();
                    fetch = require("node-fetch");
                    return [4 /*yield*/, fetch('http://192.168.43.159')];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.text()
                        //issuer id is resolved here
                    ];
                case 3:
                    data = _b.sent();
                    return [4 /*yield*/, didResolver.resolve(data)];
                case 4:
                    idoc = _b.sent();
                    return [4 /*yield*/, subject()];
                case 5:
                    sub = _b.sent();
                    issuer = {
                        '@context': [
                            "https://w3id.org/did/v1",
                            sub
                        ],
                        id: idoc.id,
                        publicKey: idoc.publicKey,
                        assertionMethod: idoc.id,
                        authentication: sdoc.id
                    };
                    iss = issuer;
                    _a = require('jsonld-signatures'), Ed25519KeyPair = _a.Ed25519KeyPair, Ed25519Signature2018 = _a.suites.Ed25519Signature2018;
                    return [4 /*yield*/, Ed25519KeyPair.generate()];
                case 6:
                    keyPair = _b.sent();
                    //const idoc = await didResolver.resolve(idoc.id)
                    keyPair.id = iss.assertionMethod;
                    keyPair.controller = idoc;
                    suite = new Ed25519Signature2018({
                        verificationMethod: keyPair.id,
                        key: keyPair
                    });
                    issuercontroller = issuer;
                    credential = {
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
                            "id": sdoc.id
                        }
                    };
                    issuer_suite = suite;
                    return [4 /*yield*/, subjectsuite()];
                case 7:
                    subject_suite = _b.sent();
                    return [4 /*yield*/, vc.issue({ credential: credential, suite: issuer_suite })];
                case 8:
                    signedVC = _b.sent();
                    return [4 /*yield*/, vc.verifyCredential({ credential: signedVC, documentLoader: documentLoader, suite: issuer_suite, controller: issuercontroller })];
                case 9:
                    vcresult = _b.sent();
                    console.log(JSON.stringify(vcresult, null, 2));
                    verifiableCredential = [signedVC];
                    presentation = vc.createPresentation({ verifiableCredential: verifiableCredential });
                    challenge = "1f44d55f-f161-4938-a659-f8026467f126";
                    domain = "4jt78h47fh47";
                    return [4 /*yield*/, vc.signPresentation({ presentation: presentation, suite: subject_suite, challenge: challenge, domain: domain })];
                case 10:
                    vp = _b.sent();
                    return [4 /*yield*/, vc.verify({ presentation: vp, documentLoader: documentLoader, challenge: challenge, domain: domain, suite: [issuer_suite, subject_suite], controller: issuercontroller })];
                case 11:
                    vpresult = _b.sent();
                    console.log(JSON.stringify(vpresult, null, 2));
                    return [2 /*return*/, signedVC];
            }
        });
    });
}
credentials();
