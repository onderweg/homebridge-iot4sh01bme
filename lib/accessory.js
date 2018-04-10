const Iot4Poll = require('./iot4-client');
const customCharacteristics = require('./custom-characteristic');

const tempSelector = (state) => parseFloat(state.temperature);
const humSelector = (state) => parseInt(state.humidity, 10);
const airSelector = (state) => parseInt(state.pressure, 10)

module.exports = (homebridge, options) => {
    
    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;    
    const CustomCharacteristic = customCharacteristics(homebridge);

    return class IotAccessory {

        constructor(log, config) {
            this.log = log;
            this.name = config.name;                           
            this.pollClient = new Iot4Poll({
                host: config.host,
                apiKey: config.apiKey,
                update_interval: parseInt(config.update_interval, 10) || 60
            });
            this.services = this.getServiceMap();   
            this.setupPolling();
        }

        getServices() {
            return Array.from(
                this.services.values()
            );
        }    

        getServiceMap() {
            const accessoryInfo = new Service.AccessoryInformation();    
            accessoryInfo
              .setCharacteristic(Characteristic.Manufacturer, "IOT4")
              .setCharacteristic(Characteristic.Model, "IOT4SH01BME")                     
              .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

            // Temperature            
            const tempService = new Service.TemperatureSensor(this.name);
            tempService                
                .getCharacteristic(Characteristic.CurrentTemperature)
                .setProps({
                    minValue: -50,
                    maxValue: 50
                })                               
                .on('get', this.getState(tempSelector).bind(this));                  
            tempService.addCharacteristic(CustomCharacteristic.AirPressure);
            
            // Humidity      
            const humService = new Service.HumiditySensor(this.name);
            humService
                .getCharacteristic(Characteristic.CurrentRelativeHumidity)
                .on('get', this.getState(humSelector).bind(this));  
 
            return new Map([
                ["accessoryInfo", accessoryInfo],
                ["tempService", tempService], 
                ["humService", humService]
            ]);
        }

        setupPolling() {
            this.pollClient.on('poll', (state) => {  
                this.log.info('Polling done → %s', JSON.stringify(state));                
                this.services.get('tempService')
                    .getCharacteristic(Characteristic.CurrentTemperature)
                    .updateValue(tempSelector(state));
            
                this.services.get('tempService')
                    .getCharacteristic(CustomCharacteristic.AirPressure)
                    .updateValue(airSelector(state));                            
            
                this.services.get('humService')
                    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
                    .updateValue(humSelector(state));                
            }); 
            this.pollClient.start();
        }

        getState(selector) {
            return async (callback) => {
                try {
                    const values = await this.pollClient.getValues();
                    callback(null, selector(values));
                } catch (e) {
                    callback(e);
                }
            }
        }
    }
}