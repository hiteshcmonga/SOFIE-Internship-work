//various libraries required
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include <HTTPClient.h>
 
const char* ssid = "hcm"; //your ssid
const char* password =  "hcm12345"; //your password

//async web server so that GET and POST requests are handled simultaneously
AsyncWebServer server(80);


//in progress
void clientverify(){
  //insert ED25519 function here
}

void ownercerverify(){
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

  //get route
  server.on("/devicecert", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "Device's cert containing DID and Signature ");
  });

    //post route
  server.on("/clientcert", HTTP_POST, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "Client's cred and owner's cred");
  });

//parsing operation
  clientverify();
  ownercertverify();
  server.begin();
}
 
void loop(){}
