#include <WiFi.h>
#include <WebServer.h>
#include <Ed25519.h>
#define NELEMS(x)  (sizeof(x) / sizeof((x)[0]))
#include <ArduinoJson.h>

char* ssid = "hcm";
char* password = "hcm12345";
WebServer server(80);

//for client verification on ESP32
uint8_t privateKey[129]="6990241810eedc6db88e4a39eafd137804a95f7b75cb4c54c807e609c3ed083e475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e";
uint8_t publicKey[65]="475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e";
uint8_t message[0];
uint8_t signature[128];


void clientverify(){

unsigned long StartTime = millis();
Ed25519::generatePrivateKey(privateKey);
Ed25519::derivePublicKey(publicKey, privateKey);
Ed25519::sign(signature,privateKey,publicKey,message,0);  
bool verify = Ed25519::verify(signature,publicKey,message,0);
if(verify!=0) {Serial.println("Client Device Verified, Access control provided");
}
else Serial.println("Fake client");
unsigned long CurrentTime = millis();
unsigned long ElapsedTime = CurrentTime - StartTime;
Serial.println("Time Taken");
Serial.println(ElapsedTime);
}

void setup() {
  // put your setup code here, to run once:
   WiFi.begin(ssid,password);
  Serial.begin(115200);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  server.on("/",[](){server.send(200,"text/plain","did:nacl:QWDkBIehFU99dzJs0kNNIf1SY_jJtZzCxUTzsW6K34g");});
  //server.on("/credentials",credentials);
//  server.on("/cred",cred);
  server.begin();
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

//for parsing operations
  unsigned long start = micros();
const size_t capacity = JSON_OBJECT_SIZE(2) + 250;
DynamicJsonDocument doc(capacity);

const char* json = "{\"privateKeyHex\":\"6990241810eedc6db88e4a39eafd137804a95f7b75cb4c54c807e609c3ed083e475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e\",\"publicKeyHex\":\"475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e\"}";

deserializeJson(doc, json);

const char* privateKeyHex = doc["privateKeyHex"]; // "6990241810eedc6db88e4a39eafd137804a95f7b75cb4c54c807e609c3ed083e475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e"
const char* publicKeyHex = doc["publicKeyHex"]; // "475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e"

unsigned long finish = micros();
unsigned long delta = finish - start;
Serial.println("TIME TAKEN TO PARSE THE KEY JSON");
Serial.println(delta);

clientverify();
}

void loop()
{
server.handleClient();
}
