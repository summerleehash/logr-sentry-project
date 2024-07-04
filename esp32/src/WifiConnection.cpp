#include "WifiConnection.h"

void connectToWifi(const char* ssid, const char* password)
{
    Serial.println("Connecting to wifi...");
    WiFi.begin(ssid, password);
    while(WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Connected to WiFi. IP Address: ");
    Serial.println(WiFi.localIP());
}