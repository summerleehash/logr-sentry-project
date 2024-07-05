#ifndef JSONDOC_H
#define JSONDOC_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <LinkedList.h>

String createJsonDoccument(String time, LinkedList<String> macList);

#endif