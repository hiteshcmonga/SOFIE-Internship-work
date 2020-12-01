# SOFIE-Internship-work
This repository contains information about the work progress, codes and related work.

## Cryptographic functions using uECC
Key generation, secret sharing using keys ,signing and verification done using Elliptical curve cryptographic methods using SHA-256  Hashing alongwith. The time taken(in milliseconds) is also measured and tested on ESP8266.

<b>Library used:</b>
- [Micro-ecc](https://github.com/kmackay/micro-ecc)


## Cryptographic functions using WolfSSL(Can try this later on)
Similar functions as mentioned in  above section with WolfSSL library being used using ESP-IDF. 
<b>Library used:</b>
- [wolfSSL]( https://github.com/wolfSSL/wolfssl
) 


![wolfcrypt benchmarks](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/wolfcryptbenchmark.png)



## Flow and Implementation details

For serialising the json data and loading the esp32 device certificates onto local webserver use ```serializejson.ino``` , the webserver is HTTP type and not secure, a HTTPS server for the same purpose can be implemented in future. The certificates are then fetched by client (added functionality in ```vcjsfinal.ts```) and stored in local file and then certificates are verified by client. The client then sends its credentials using POST request to local webserver and the client credentials are verified by ESP32 using crypto library by verifying signatures.


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

- Verifiable credentials Part (tested on local machine)
Verifiable credentials implementation using ```vc-js```and other libraries. Issuer and subject are being considered different entities so as to facilitate the required implementation of credentials. A customised documentLoader has been made to derefence the required URLs. Verifiable credential has been signed using  ```jsonld-signatures``` and it is verified against the issuer suite and the Verifiable presentations take both the arrays of ```issuer_suite``` and ``` subject_suite```.

-Running the script: clone the repository and npm install the required dependencies and then  ```tsc vcjsfinal.ts``` and ```node vcjsfinal.js``` (files available at [vcjsfinal.ts](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/codes/VC%20test/vcjsfinal.ts) to implement verifiable credentials on local machine

- Download the [arduino IDE](https://www.arduino.cc/en/main/software) and then choose ESP32 from the ```Tools->Boards->ESP32``` and then run the Serializejson.ino(https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/codes/VC%20test/serializejson.ino) file to serialise the json credentials and to send the credentials on ESP32 server( the IP adress on which the credentials are available is available on the serial monitor, use IPadress/credentials(for example: 192.43.4/credentials) to access the credentials. These credentials will be verified in the  [vcjsfinal.ts](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/codes/VC%20test/vcjsfinal.ts) (I am working on its implementation) and to deserialize/ parsing operation can be done using (testparser.ino)[https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/codes/VC%20test/testparser.ino] this file can also be executed in the same manner.
- The implementation for verification of client certificates on ESP32 device is pending







<b>Libraries used:</b>
- [nacl did resolver and manager](https://github.com/uport-project/nacl-did)
- [vc-js](https://github.com/digitalbazaar/vc-js)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)





## screenshots and results
uECC results:
![uECC results](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/uecclatest.png)
verifiable credential:
![Verifiable credentail](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/createvc.png)
verifiable presentation:
![verifiable presentatiton](https://github.com/hiteshcmonga/SOFIE-Internship-work/blob/master/results/createvp1.png)



