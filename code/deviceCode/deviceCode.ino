
#include "didkeyGeneration.h"
#include "webServerRoute.h"


/* function to print HEX chars
  void printNumber(const uint8_t *x, uint8_t len)
  {
    static const char hexchars[] = "0123456789abcdef";
    Serial.print(" = ");
    for (uint8_t posn = 0; posn < len; ++posn) {
        Serial.print(hexchars[(x[posn] >> 4) & 0x0F]);
        Serial.print(hexchars[x[posn] & 0x0F]);
    }s
    Serial.println();
  }*/



void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {

    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  
  Serial.println(WiFi.localIP());
  didkey();
  sendDid();
  receiveVC();
  // clientCert();
  server.begin();
}


void loop() {}
