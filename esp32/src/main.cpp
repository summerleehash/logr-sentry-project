#include <WiFiConnection.h>
#include <TimeService.h>
#include <BLEScanner.h>
#include <JsonDoc.h>
#include <ServerPost.h>
#include <Secrets.h>

void setup()
{
  Serial.begin(115200);
  connectToWifi(ssid, password);
  setupBLEScan();
}

void loop()
{
  startBLEScan(5);
  String jsonPayLoad = createJsonDoccument(getTimeFromAPI(), macList);
  Serial.println("Time from API Server");
  Serial.println(getTimeFromAPI());
  postRequest(serverURL, jsonPayLoad, apiKey);
  delay(30000);
}