const IotAccessory = require('./lib/accessory');

module.exports = function(homebridge) {              
    homebridge.registerAccessory(
        'homebridge-iot4sh01bme', 
        'IOT4SH01BME', 
        IotAccessory(homebridge)
    );
}