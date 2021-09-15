#include "Base58.h"
#include <Crypto.h>
#include <Ed25519.h>
#include <string>
#include "WiFi.h"
#include "ESPAsyncWebServer.h"

const char* ssid = "hcm"; //your ssid
const char* password =  "hcm12345"; //your password

//async web server so that GET and POST requests are handled simultaneously
AsyncWebServer server(80);

uint8_t privateKey[32];
uint8_t publicKey[32];
uint8_t message[2] = {1, 2};
uint8_t signature[64];
char encodedPublicKey[47];
String didKey;


  //function to print HEX chars
  void printNumber(const uint8_t *x, uint8_t len)
  {
    static const char hexchars[] = "0123456789abcdef";
    Serial.print(" = ");
    for (uint8_t posn = 0; posn < len; ++posn) {
        Serial.print(hexchars[(x[posn] >> 4) & 0x0F]);
        Serial.print(hexchars[x[posn] & 0x0F]);
    }
    Serial.println();
  }



//function for keypair generation, for testing only, after finalisation will put this in different header
void didKey() {
  Ed25519::generatePrivateKey(privateKey);
  Ed25519::derivePublicKey(publicKey, privateKey);
  uint8_t start_byte[1]={0xed};
  uint8_t concatpublicKey[sizeof(start_byte)+sizeof(publicKey)];
  memcpy(concatpublicKey,start_byte, sizeof(start_byte));
  memcpy(concatpublicKey + sizeof(start_byte), publicKey, sizeof(publicKey));
 // printNumber(concatpublicKey,sizeof(start_byte)+sizeof(publicKey));
  base58Encode(concatpublicKey, 32, encodedPublicKey, 47);
  didKey = "did:key:z" + String(encodedPublicKey);
  didKey=didKey.substring(0,52);
  Serial.println(didKey);

}

void clientCert() {
  //post route
  server.on("/clientcert", HTTP_POST, [](AsyncWebServerRequest * request) {
    request->send(200, "text/plain", "Client's cred and owner's cred");
  });
}

void deviceDid() {
  didGeneration();
  //get route, to publish device's DID
  server.on("/devicedid", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, "text/plain", didKey);
  });
}


void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {

    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println(WiFi.localIP());
  didKey();
  deviceDid();
  clientCert();
  server.begin();
}


void loop() {}
