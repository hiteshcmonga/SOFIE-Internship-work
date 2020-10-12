
#include <WiFi.h>
#include <WebServer.h>
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
  server.on("/",[](){server.send(200,"text/plain","did:nacl:QWDkBIehFU99dzJs0kNNIf1SY_jJtZzCxUTzsW6K34g");});
  //server.on("/credentials",credentials);
//  server.on("/cred",cred);
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
