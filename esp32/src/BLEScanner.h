#ifndef BLESCANNER_H
#define BLESCANNER_H

#include <Arduino.h>
#include <LinkedList.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

extern LinkedList<String> macList;

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice);
};

void setupBLEScan();


/**
 * @brief 
 * @param [in] duration The duration in seconds for which to scan.
 */
void startBLEScan(uint32_t duration);

#endif