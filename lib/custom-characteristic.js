const inherits = require('util').inherits;

const CustomUUID = {
	// Eve UUID
    AirPressure: 'E863F10F-079E-48FF-8F27-9C2605A29F52'
};

/**
 * CustomCharacteristic factory
 */
module.exports = function (homebridge) {	
    Characteristic = homebridge.hap.Characteristic;    
    CustomCharacteristic = {};
    
    CustomCharacteristic.AirPressure = function() {
        Characteristic.call(this, 'Air Pressure', CustomUUID.AirPressure);
        this.setProps({
            format: Characteristic.Formats.UINT16,
            unit: "hPa",
            maxValue: 1100,
            minValue: 700,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };
    inherits(CustomCharacteristic.AirPressure, Characteristic);

    return CustomCharacteristic;
}