# SOFIE-Internship-work
This repository contains information about the work progress, codes and related work.

## Cryptographic functions using uECC
Key generation, secret sharing using keys ,signing and verification done using Elliptical curve cryptographic methods using SHA-256  Hashing alongwith. The time taken(in milliseconds) is also measured and tested on ESP8266.

<b>Library used:</b>
- [Micro-ecc](https://github.com/kmackay/micro-ecc)


## Cryptographic functions using WolfSSL
Similar functions as mentioned in  above section with WolfSSL library being used using ESP-IDF. 
<b>Library used:</b>
- [wolfSSL]( https://github.com/wolfSSL/wolfssl
)

## Verifiable credentials Part (tested on local machine)
Verifiable credentials implementation using ```bash vc-js```and other libraries. Issuer and subject are being considered different entities so as to facilitate the required implementation of credentials. A customised documentLoader has been made to derefence the required URLs. Verifiable credential has been signed using  ```jsonld-signatures``` and it is verified against the issuer suite and the Verifiable presentations take both the arrays of ```issuer_suite``` and ``` subject_suite```.

Running the script: npm install the required dependencies and then  ```tsc vcjsfinal.ts``` and ```node vcjsfinal.js```

<b>Libraries used:</b>
- [nacl did resolver and manager](https://github.com/uport-project/nacl-did)
- [vc-js](https://github.com/digitalbazaar/vc-js)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)

<b>Tasks list for verifiable part</b>
- [ ] implementing SOFIE custom context in credentials
- [ ] Add device info and other hardware parameters

## screenshots and results
uECC results:
![uECC results](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/uecclatest.png)
verifiable credential:
![Verifiable credentail](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/createvc.png)
verifiable presentation:
![verifiable presentatiton](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/createvp1.png)



