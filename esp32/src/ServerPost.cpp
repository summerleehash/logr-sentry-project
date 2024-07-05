#include "ServerPost.h"
#include "Secrets.h"

String postRequest(String url, String jsonPayLoad)
{
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + apiKey);  // Add API key to the header

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