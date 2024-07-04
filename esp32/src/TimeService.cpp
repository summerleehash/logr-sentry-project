#include "TimeService.h"
#include <ArduinoJson.h>

const char *timeAPIUrl = "http://worldtimeapi.org/api/timezone/Australia/Adelaide";

String getTimeFromAPI()
{
    HTTPClient http;
    http.begin(timeAPIUrl);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
        String payload = http.getString();
        Serial.println("HTTP response code: " + String(httpResponseCode));
        Serial.println("Response: "+ payload);

        //Parse the JSON response to get the current date/time
        JsonDocument timeInfo;
        deserializeJson(timeInfo, payload);

        String dateTime = timeInfo["datetime"]; //maybe use unix time???
        return dateTime;
    }
    else
    {
        Serial.println("Error in HTTP request: " + String(httpResponseCode));
        return "";
    }
    http.end();
}