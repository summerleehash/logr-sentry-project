#ifndef JSONREQUEST_H
#define JSONREQUEST_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <LinkedList.h>

String createJsonDoccument(String time, LinkedList<String> macList);

#endif