#include <WiFi.h>
#include <WebServer.h>
#include <Ed25519.h>
#define NELEMS(x)  (sizeof(x) / sizeof((x)[0]))
#include <ArduinoJson.h>

char* ssid = "hcm"; //your ssid
char* password = "hcm12345"; //your pass 
WebServer server(80); 



void clientverify(){
uint8_t privateKey1[129];
uint8_t publicKey1[65]="475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e"; //publickey obtained from client, this is hard coded here, we can use parsed expression as well.
uint8_t message1[0];
uint8_t signature1[128];
//unsigned long StartTime = millis();
Ed25519::generatePrivateKey(privateKey1);
Ed25519::derivePublicKey(publicKey1, privateKey1);
Ed25519::sign(signature1,privateKey1,publicKey1,message1,0);  
bool verify = Ed25519::verify(signature1,publicKey1,message1,0);
if(verify!=0) {Serial.println("Client Device Verified, Access control provided");
}
else Serial.println("Fake client");
}

void ownercertverify(const char* credentialSubject_accessRights_0){
uint8_t privateKey2[129];
uint8_t publicKey2[65]="fc97e71f25c7f49d7d21553596a68b4255a9d2d8bcc00ee973c7ba549892f24b"; //publickey obtained from owner, this is hard coded here, we can use parsed expression as well.
uint8_t message2[0];
uint8_t signature2[128];
Ed25519::generatePrivateKey(privateKey2);
Ed25519::derivePublicKey(publicKey2, privateKey2);
Ed25519::sign(signature2,privateKey2,publicKey2,message2,0);  
bool verify = Ed25519::verify(signature2,publicKey2,message2,0);
if(verify!=0) {
Serial.println("Owner certificate verified, giving access right according to the certificate");
if(credentialSubject_accessRights_0="read") {Serial.println("Providing lamp control");}
else Serial.println ("No access provided!");}
else Serial.println("No access rights found!");

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
  //server.on("/cred",cred);
  server.begin();
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());


//the parsing operation
  const size_t capacity = 3*JSON_ARRAY_SIZE(2) + 2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(7) + 580;
DynamicJsonDocument doc(capacity);
const char* _context_0 = doc["@context"][0]; // "https://www.w3.org/2018/credentials/v1"
const char* _context_1 = doc["@context"][1]; // "https://www.w3.org/2018/credentials/examples/v1"

const char* type_0 = doc["type"][0]; // "VerifiableCredential"
const char* type_1 = doc["type"][1]; // "IoTAccessRightsCredential"

const char* issuanceDate = doc["issuanceDate"]; // "2010-01-01T19:23:24Z"

const char* issuer_id = doc["issuer"]["id"]; // "did:nacl:EiyBAUQu1BJy1JRCeba-XEoa8Tyzpck_cvnW-92tFJ8"
const char* issuer_name = doc["issuer"]["name"]; // "Owner"

const char* credentialSubject_id = doc["credentialSubject"]["id"];

const char* credentialSubject_accessRights_0 = doc["credentialSubject"]["accessRights"][0]; // "read"

const char* credentialSubject_accessRights_1 = doc["credentialSubject"]["accessRights"][1]; // "write"

const char* Publickeyowner = doc["Publickeyowner"];
const char* PublicKeyclient = doc["PublicKeyclient"];
const char* json = "{\"@context\":[\"https://www.w3.org/2018/credentials/v1\",\"https://www.w3.org/2018/credentials/examples/v1\"],\"type\":[\"VerifiableCredential\",\"IoTAccessRightsCredential\"],\"issuanceDate\":\"2010-01-01T19:23:24Z\",\"issuer\":{\"id\":\"did:nacl:EiyBAUQu1BJy1JRCeba-XEoa8Tyzpck_cvnW-92tFJ8\",\"name\":\"Owner\"},\"credentialSubject\":{\"id\":\"did:nacl:z5Uv_FxVyS_63zRJ_lNT9C0Smv9yDtFPeEjSUUvlizI\",\"accessRights\":[\"read\",\"write\"]},\"Publickeyowner\":\"fc97e71f25c7f49d7d21553596a68b4255a9d2d8bcc00ee973c7ba549892f24b\",\"PublicKeyclient\":\"475cb21ae1b0d0bd43a597b05912fb3d7baa1ee4ebd683e0a543f748d5aa659e\"}";
deserializeJson(doc, json);
clientverify();
ownercertverify(credentialSubject_accessRights_0);
}



void loop()
{
server.handleClient();
}
