//various libraries required
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
//#include "AsyncJson.h"
//#include "ArduinoJson.h"
//#include <HTTPClient.h>
#include <Crypto.h>
#include <Ed25519.h>
 
const char* ssid = "hcm"; //your ssid
const char* password =  "hcm12345"; //your password

//async web server so that GET and POST requests are handled simultaneously
uint8_t privateKey[32];
uint8_t publicKey[32];
uint8_t message[2]={1,2};
uint8_t signature[64];


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

//in progress
void generateKey(){
  //insert ED25519 function here
  unsigned long startTime = millis();
  Ed25519::generatePrivateKey(privateKey);
  Ed25519::derivePublicKey(publicKey, privateKey);
  unsigned long currentTime = millis();
  unsigned long elapsedTime =currentTime- startTime ;
  Serial.println("Private Key:");
  printNumber(privateKey,32);
   Serial.println("Public Key:");
  printNumber(publicKey,32);
  Serial.println("Message:");
  printNumber(message,2);
  Serial.println("Time Taken");
  Serial.println(elapsedTime);
  
}

void verifySignature(){
  Ed25519::sign(signature,privateKey,publicKey,message,2); 
  Serial.println("Signature:");
   printNumber(signature,64);
  bool verify = Ed25519::verify(signature,publicKey,message,2);
  if(verify) 
    {Serial.println("Client Device Verified, Access control provided");
      }
  else 
     Serial.println("Fake client");
}

void ownercerVerify(){
  //insert updated code here
}




void setup(){
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
      
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println(WiFi.localIP());
  generateKey();
  verifySignature();
}
 
void loop(){}
