

#define WIFI_SSID "hcm"
#define WIFI_PSK  "hcm123456"

// Include certificate data
#include "cert.h"
#include "private_key.h"
#include <WiFi.h>
#include <HTTPSServer.hpp>
#include <HTTPServer.hpp>
#include <SSLCert.hpp>
#include <HTTPRequest.hpp>
#include <HTTPResponse.hpp>

using namespace httpsserver;

SSLCert cert = SSLCert(
  example_crt_DER, example_crt_DER_len,
  example_key_DER, example_key_DER_len
);


HTTPSServer secureServer = HTTPSServer(&cert);
HTTPServer insecureServer = HTTPServer();
void handleRoot(HTTPRequest * req, HTTPResponse * res);
void handle404(HTTPRequest * req, HTTPResponse * res);

void setup() {
  // For logging
  Serial.begin(115200);

  // Connect to WiFi
  Serial.println("Setting up WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PSK);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.print("Connected. IP=");
  Serial.println(WiFi.localIP());
  ResourceNode * nodeRoot = new ResourceNode("/", "GET", &handleRoot);
  ResourceNode * node404  = new ResourceNode("", "GET", &handle404);
  secureServer.registerNode(nodeRoot);
  insecureServer.registerNode(nodeRoot);
  secureServer.setDefaultNode(node404);
  insecureServer.setDefaultNode(node404);

  Serial.println("Starting HTTPS server...");
  secureServer.start();
  Serial.println("Starting HTTP server...");
  insecureServer.start();
  if (secureServer.isRunning() && insecureServer.isRunning()) {
    Serial.println("Servers ready.");
  }
}

void loop() {
  // We need to call both loop functions here
  secureServer.loop();
  insecureServer.loop();

  // Other code would go here...
  delay(1);
}

void handleRoot(HTTPRequest * req, HTTPResponse * res) {
  res->setHeader("Content-Type", "text/html");

  res->println("<!DOCTYPE html>");
  res->println("<html>");
  res->println("<head><title>Hello World!</title></head>");
  res->println("<body>");
  res->println("<h1>Hello World!</h1>");

  res->print("<p>Your server is running for ");
  res->print((int)(millis()/1000), DEC);
  res->println(" seconds.</p>");

  if (req->isSecure()) {
    res->println("<p>You are connected via <strong>HTTPS</strong>.</p>");
  } else {
    res->println("<p>You are connected via <strong>HTTP</strong>.</p>");
  }

  res->println("</body>");
  res->println("</html>");
}

void handle404(HTTPRequest * req, HTTPResponse * res) {
  req->discardRequestBody();
  res->setStatusCode(404);
  res->setStatusText("Not Found");
  res->setHeader("Content-Type", "text/html");
  res->println("<!DOCTYPE html>");
  res->println("<html>");
  res->println("<head><title>Not Found</title></head>");
  res->println("<body><h1>404 Not Found</h1><p>The requested resource was not found on this server.</p></body>");
  res->println("</html>");
}
