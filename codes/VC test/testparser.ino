#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>
#include <ArduinoJson.h>
ESP8266WebServer server;
char* ssid = "hcm"; //ssid
char* password = "hcm123456"; //pass

void setup()
{
 
  WiFi.begin(ssid,password);
  Serial.begin(115200);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  server.on("/",[](){server.send(200,"text/plain","HomePage");});
  server.on("/credentials",credentials);
  server.begin();
}

void loop()
{
server.handleClient();
}

void credentials(){
server.send(200,"text/plain","certificate successfully parsed!");
//certificate can be parsed from using http request as well.
const size_t capacity = JSON_ARRAY_SIZE(1) + 2*JSON_ARRAY_SIZE(2) + JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(6) + 720;
DynamicJsonBuffer jsonBuffer(capacity);

const char* json = "[{\"@context\":[\"https://www.w3.org/2018/credentials/v1\",\"https://www.w3.org/2018/credentials/examples/v1\"],\"type\":[\"VerifiableCredential\",\"IoTAccessRightsCredential\"],\"issuanceDate\":\"2010-01-01T19:23:24Z\",\"issuer\":{\"id\":\"did:nacl:PWuwXYyxqMqFPS0M6v6_nOljcFAgSW68Aukn4uUo-HA\",\"name\":\"Owner\"},\"credentialSubject\":{\"id\":\"did:nacl:wnY8UBQl1EJTRjDhbQZz286TrCUaUatKsReU9nktvLs\"},\"proof\":{\"type\":\"Ed25519Signature2018\",\"created\":\"2020-07-16T17:19:39Z\",\"jws\":\"eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..9iF610DRRFxerktAvnT0qw95EZtFAoKjXhKGusGP8rezquTzWa3vSuraCHjqTltXNwj_uyZLgjqCPrgNUgDoBg\",\"proofPurpose\":\"assertionMethod\",\"verificationMethod\":\"did:nacl:PWuwXYyxqMqFPS0M6v6_nOljcFAgSW68Aukn4uUo-HA\"}}]";

JsonArray& root = jsonBuffer.parseArray(json);

JsonObject& root_0 = root[0];

const char* root_0__context_0 = root_0["@context"][0]; // "https://www.w3.org/2018/credentials/v1"
const char* root_0__context_1 = root_0["@context"][1]; // "https://www.w3.org/2018/credentials/examples/v1"

const char* root_0_type_0 = root_0["type"][0]; // "VerifiableCredential"
const char* root_0_type_1 = root_0["type"][1]; // "IoTAccessRightsCredential"

const char* root_0_issuanceDate = root_0["issuanceDate"]; // "2010-01-01T19:23:24Z"

const char* root_0_issuer_id = root_0["issuer"]["id"]; // "did:nacl:PWuwXYyxqMqFPS0M6v6_nOljcFAgSW68Aukn4uUo-HA"
const char* root_0_issuer_name = root_0["issuer"]["name"]; // "Owner"

const char* root_0_credentialSubject_id = root_0["credentialSubject"]["id"]; // "did:nacl:wnY8UBQl1EJTRjDhbQZz286TrCUaUatKsReU9nktvLs"

JsonObject& root_0_proof = root_0["proof"];
const char* root_0_proof_type = root_0_proof["type"]; // "Ed25519Signature2018"
const char* root_0_proof_created = root_0_proof["created"]; // "2020-07-16T17:19:39Z"
const char* root_0_proof_jws = root_0_proof["jws"]; // "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..9iF610DRRFxerktAvnT0qw95EZtFAoKjXhKGusGP8rezquTzWa3vSuraCHjqTltXNwj_uyZLgjqCPrgNUgDoBg"
const char* root_0_proof_proofPurpose = root_0_proof["proofPurpose"]; // "assertionMethod"
const char* root_0_proof_verificationMethod = root_0_proof["verificationMethod"]; // "did:nacl:PWuwXYyxqMqFPS0M6v6_nOljcFAgSW68Aukn4uUo-HA"

root_0.printTo(Serial);


    }
