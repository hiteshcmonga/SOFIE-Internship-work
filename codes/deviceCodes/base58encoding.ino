#include "Base58.h"
#include <Crypto.h>
#include <Ed25519.h>
#include "WiFi.h"


const char* ssid = "hcm"; //your ssid
const char* password =  "hcm12345"; //your password


uint8_t privateKey[32];
uint8_t publicKey[32];
uint8_t message[2]={1,2};
uint8_t signature[64];

char encoded[44];



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


void keypair(){
  Ed25519::generatePrivateKey(privateKey);
  Ed25519::derivePublicKey(publicKey, privateKey);
}

void base58encoding(){
  keypair();
  base58Encode(publicKey,32,encoded,sizeof(encoded));
  Serial.println(encoded);
  Serial.println(sizeof(encoded));
  
  
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
      
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  keypair();
  printNumber(publicKey,32);
  base58encoding();
}

void loop() {
  // put your main code here, to run repeatedly:

}
