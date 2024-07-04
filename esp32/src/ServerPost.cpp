#include "ServerPost.h"

String postRequest(String url, String jsonPayLoad)
{
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    // Send HTTP POST request
    int httpResponseCode = http.POST(jsonPayLoad);
    
    String response = "";
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on HTTP request");
    }
    
    // Free resources
    http.end();

    return response;
}