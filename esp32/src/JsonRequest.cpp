#include "JsonRequest.h"

String createJsonDoccument(String time, LinkedList<String> macList)
{
    StaticJsonDocument<200> doc;
    doc["time"] = time;
    JsonArray macArray = doc.createNestedArray("macList");
    int size = macList.size();
    for(int i = 0; i < size; i++)
    {
        macArray.add(macList.get(i));
    }
    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
}