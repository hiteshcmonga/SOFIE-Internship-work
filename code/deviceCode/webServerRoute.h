
#include "WiFi.h"
#include "ESPAsyncWebServer.h"

const char* ssid = "hcm"; // your ssid
const char* password =  "hcm12345"; // your password

// async web server so that GET and POST requests are handled simultaneously
AsyncWebServer server(80);


void clientCert() {
  //post route
  server.on("/clientcert", HTTP_POST, [](AsyncWebServerRequest * request) {
    request->send(200, "text/plain", "Client's cred and owner's cred");
  });
}

void sendDid() {
  // GET route, to publish device's DID

  server.on("/devicedid", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, "text/plain", didKey);
  });
}
