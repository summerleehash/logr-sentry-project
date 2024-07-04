# logr-sentry-project


# ESP32 Secrets File

In the file

`/esp32/src/Secrets.h`

Add the following

```cpp
//WiFi Info
const char *ssid = "WIFI_SSID_HERE";
const char *password = "WIFI_PASSWORD_HERE";

//Server Info
const char *serverURL = "API_HOST/api/clusters";

//Server API Key
const char *apiKey = "API_KEY_GOES_HERE";
```