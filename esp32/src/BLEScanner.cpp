#include "BLEScanner.h"

LinkedList<String> macList = LinkedList<String>();

void MyAdvertisedDeviceCallbacks::onResult(BLEAdvertisedDevice advertisedDevice)
{
    Serial.printf("Device found: %s\n", advertisedDevice.toString().c_str());
    macList.add(advertisedDevice.getAddress().toString().c_str());
}

void setupBLEScan()
{
    BLEDevice::init("");
    BLEScan *pBLEScan = BLEDevice::getScan();
    pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
    pBLEScan->setActiveScan(true);
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);
}

void startBLEScan(uint32_t duration)
{
    Serial.println("Starting BLE scan...");
    BLEScan *pBLEScan = BLEDevice::getScan();
    BLEScanResults foundDevices = pBLEScan->start(duration, false);
    int deviceCount = foundDevices.getCount();

    if (deviceCount == 0)
    {
        Serial.println("No BLE devices found.");
    }
    else
    {
        Serial.printf("Scan complete. Found %d devices.\n", deviceCount);
    }

    pBLEScan->stop();
    pBLEScan->clearResults();
}