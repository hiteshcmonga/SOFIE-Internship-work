# SOFIE-Internship-work
This repository contains information about the work progress, codes and related work.

## Cryptographic functions using uECC(Obsolete)
Key generation, secret sharing using keys ,signing and verification done using Elliptical curve cryptographic methods using SHA-256  Hashing alongwith. The time taken(in milliseconds) is also measured and tested on ESP8266.

<b>Library used:</b>
- [Micro-ecc](https://github.com/kmackay/micro-ecc)

## Cryptographic functions using Crypto (used in final code)
Key generation, secret sharing using keys ,signing and verification done using Elliptical curve cryptographic methods(ED25519 curve). The time taken(in milliseconds) is also measured and tested on ESP32.

<b>Library used:</b>
- [Crypto](https://www.arduino.cc/reference/en/libraries/crypto/))


## Cryptographic functions using WolfSSL(Can try this later on)
Similar functions as mentioned in  above section with WolfSSL library being used using ESP-IDF. 
<b>Library used:</b>
- [wolfSSL]( https://github.com/wolfSSL/wolfssl) 


![wolfcrypt benchmarks](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/wolfcryptbenchmark.png)

## Parsing Operations
For parsing operations in ESP32, an external library, arduinoJSON library is used.
<b>Library used:</b>
- [ArduinoJSON](https://github.com/bblanchon/ArduinoJson) 



##  VC flow implementation
The goal of the task is to create and verify verifiable credentials and to complete  the VC flow as suggested by the W3C Consortium (https://www.w3.org/TR/vc-data-model/). This task is done using the VC-JS library on the client side .
- [nacl did resolver and manager](https://github.com/uport-project/nacl-did)
- [vc-js](https://github.com/digitalbazaar/vc-js)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)



## Flow and Implementation details

- Owner has ESP32 which can control some resources. Device(ESP32) has its own DID and signature suite for its Verifiable Certificates is generated named issuer_suite . Connection between client (a laptop is used for implementation) and ESP-32 is established then.
- Device sends its DID and the DID is resolved on the client side(to save time) and accordingly VC is generated using the DID resolver and signature suite.
- Now the device is verified on the client using the VC-JS library. The verification results specify the type and date of creation of signature and along with jws payload and verification methods used.
- After successful verification, the client's publickey (to verify whether the client is trustworthy or not) and the owner’s VC for the client (which provides information about access control) is sent to the device for verification. 
- The VC is parsed (To verify that owner has given access to the client) and the client’s public key is used for signature generation and verification (to verify the client) and Access control is provided once mutual authentication is done.




##  Task Lists and progress
- [X] Serialising JSON Data of ESP32
- [X] Sending ESP32 JSON Data to webserver
- [X] Fetch ESP32 DID
- [X] verifying the ESP32 credentials
- [X] POST client credentials 
- [X] Parsing client credentials //code needs slight modification
- [X] verifying the signatures of client and sending feedback.
- [X] access control after mutual verification is done. 


## Steps for implementation

- Clone the repo from https://github.com/hiteshcmonga/SOFIE-Internship-work
- Open vc_test folder of the repo and open vcjsfinal.js (you may change package.json and tsconfig.json depending on your environment ), install all the dependencies required by using the command “npm install” in VC_test directory and then execute the code using node vcjsfinal.js
- For code editing and better code understanding you can use the typescript version of same code which is ```vcjsfinal.ts``` and this can be executed after installing typescript package(command: npm install -g typescript ) and then execute the code using  tsc vcjsfinal.ts
- The arduino code is available as FinalESP32.ino in codes folder of the repo. You need an arduino IDE to execute and check the code(https://www.arduino.cc/en/main/software) and then choose ESP32 from the Tools->Boards->ESP32 and to setup ESP32 support in the arduino IDE users can follow the linked [tutorial](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/) or can use a similar approach for other operating system. After that external dependencies of ArduinoJSON and Crypto library needs to be installed and then finally user can run the ```FinalESP32.ino``` code.
- After the typescript code is executed, run node vcjsfinal.js, you can see the verification results of the device (You need to connect the ESP32 device and execute the arduino code first).
- After the arduino code is run, it will verify the client's credential, on successful verification, this specifies that verification is successful (on serial monitor) and provides access control accordingly.



## screenshots and results
uECC results:
![uECC results](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/uecclatest.png)
verifiable credential:
![Verifiable credentail](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/createvc.png)
verifiable presentation:
![verifiable presentatiton](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/createvp1.png)



