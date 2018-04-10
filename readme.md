# Homebridge plugin for IOT4SH01BME

Homebridge plugin for [IOT4 IOT4SH01BME](https://www.iot4.eu) Wifi temperature, humidity and barometric pressure sensor.

## Installation

1. Install homebridge
2. Install this plugin using: `npm install -g https://github.com/onderweg/homebridge-iot4sh01bme.git` (this package is not yet available on NPM)
3. Update your Homebridge configuration file (`config.json`)

## Configuration

The available fields in the config.json file are:
 - `accessory` [required] Always "IOT4SH01BME"
 - `name` [required] Descriptive name of virtual device
 - `host` [required] IP or host name of iot4 device on the local network. Note that this host must be reachable from the HomeBridge instance.
 - `update_interval` Polling frequency in seconds (default 60)
 - `apiKey` [required] API key, can be found in admin interface

Example config values:

```
"accessories": [
    {
        "accessory": "IOT4SH01BME",
        "name": "My sensor",
        "host": "192.168.1.244",
        "apiKey": "C39E924DD65FG82A",
        "update_interval": 60
    }    
]
```

Make sure that **"Enable HTTP API"** is turned on in the IOT4 admin interface before using this plugin.

## Notes

- HomeKit does not support barometric pressure sensors at the moment. Pressure value is recorded as custom charaterisic, but not visible in Homekit.