
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
char* ssid = "hcm";
char* password = "hcm123456";
WebServer server(80);

void setup() {
  // put your setup code here, to run once:
   WiFi.begin(ssid,password);
  Serial.begin(115200);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  server.on("/",[](){server.send(200,"text/plain","HomePage");});
  server.on("/credentials",credentials);
  server.on("/cred",cred);
  server.begin();
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

}

void loop()
{
server.handleClient();
}



String credentials() {
const size_t capacity = JSON_ARRAY_SIZE(1) + 2*JSON_ARRAY_SIZE(2) + JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(6);
DynamicJsonDocument doc(capacity);

JsonObject doc_0 = doc.createNestedObject();

JsonArray doc_0__context = doc_0.createNestedArray("@context");
doc_0__context.add("https://www.w3.org/2018/credentials/v1");
doc_0__context.add("https://www.w3.org/2018/credentials/examples/v1");

JsonArray doc_0_type = doc_0.createNestedArray("type");
doc_0_type.add("VerifiableCredential");
doc_0_type.add("IoTAccessRightsCredential");
doc_0["issuanceDate"] = "2010-01-01T19:23:24Z";

JsonObject doc_0_issuer = doc_0.createNestedObject("issuer");
doc_0_issuer["id"] = "did:nacl:1XJOLWlaXe-WZsb81puc6DmvXbQP_nIMeL1aI1jAC3Y";
doc_0_issuer["name"] = "ESPdevice";
JsonObject doc_0_credentialSubject = doc_0.createNestedObject("credentialSubject");
doc_0_credentialSubject["id"] = "did:nacl:OPfRXOIVWiUBjdPHTVDaM-VASNqllapShK8iY80NsQQ";

JsonObject doc_0_proof = doc_0.createNestedObject("proof");
doc_0_proof["type"] = "Ed25519Signature2018";
doc_0_proof["created"] = "2020-08-05T11:20:15Z";
doc_0_proof["jws"] = "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..xybWs4UajNsThNsArvFoa83hsTfffYWXxIz2SFj6ux84RDaOVUYr2quO1IGGfUOVgej1at3l0LXyoTYNREZGBA";
doc_0_proof["proofPurpose"] = "assertionMethod";
doc_0_proof["verificationMethod"] = "did:nacl:1XJOLWlaXe-WZsb81puc6DmvXbQP_nIMeL1aI1jAC3Y";

String json;
serializeJson(doc, json);
server.send(200,"text/json", json);
}
