
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include "AsyncJson.h"
#include "ArduinoJson.h"

const char* ssid = "hcm"; // your ssid
const char* password =  "hcm12345"; // your password


// async web server so that GET and POST requests are handled simultaneously
AsyncWebServer server(80);

String receiveVC() {
  // route to receive & handle VC generated by owner
  AsyncCallbackJsonWebHandler *handler = new AsyncCallbackJsonWebHandler("/devicevc", [](AsyncWebServerRequest * request, JsonVariant & json) {
    StaticJsonDocument<1000> data;
    if (json.is<JsonArray>())
    {
      data = json.as<JsonArray>();
    }
    else if (json.is<JsonObject>())
    {
      data = json.as<JsonObject>();
    }
    String response;
    serializeJson(data, response);
    request->send(200, "application/json", response);
    Serial.println(response);
  });
  server.addHandler(handler);
}


void sendDid() {
  // GET route, to publish device's DID

  server.on("/devicedid", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, "text/plain", didKey);
  });
}
