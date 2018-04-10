const EventEmitter = require('events');
const http = require('http');
const { URL } = require('url');

const retrieve = (options) => {    
    return new Promise((resolve, reject) => {
        let body = "";
        const req = http.request(options, (res) => {            
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(new Error('Request failed with status code: ' + res.statusCode));
                return;
            }
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(body.trim());
            });
        });
        req.on('error', (e) => {
            reject(new Error('Problem with request: ' + e.message));
        });
        req.on('socket', (socket) => {
            socket.setTimeout(5000);  
            socket.on('timeout', function() {
                reject(new Error(`Timeout on request to URL ${req.path}`));
                req.abort();
            });
        });        
        req.end();
    });
};

const getTemperature = async (urlConstructor) => {
    const temp = await retrieve(urlConstructor('/api//api/temperature'));
    return parseFloat(temp);
}

const getHumidity = async (urlConstructor) => {
    const temp = await retrieve(urlConstructor('/api//api/humidity'));
    return parseInt(temp);
}

const getPressure = async (urlConstructor) => {
    const temp = await retrieve(urlConstructor('/api//api/pressure'));
    return parseInt(temp);
}

const constructUrl = ({host, apiKey}) => (path) => {
    return new URL(`http://${host}${path}/?apikey=${apiKey}`);
}

class Iot4Poll extends EventEmitter {
	constructor({host, apiKey, update_interval}) {
		super();
        this.update_interval = update_interval;
        this.host = host;
        this.timer = null;
        this.urlConstructor = constructUrl({
            host,
            apiKey
        })
	}

	start() {		
		this.timer = setInterval(() => {            
			this.poll();
        }, this.update_interval * 1000);
    }

    async getValues() {
        const temperature = await getTemperature(this.urlConstructor);
        const humidity = await getHumidity(this.urlConstructor);
        const pressure = await getPressure(this.urlConstructor);
        return {
            temperature,
            humidity,
            pressure
        }    
    }    
    
    async poll() {
        try {
           const data = await this.getValues();
           this.emit('poll', data);
        } catch (e) {
            console.log('Error while polling for iot4 data: ' + e.message);
        }
    }

	stop() {
		clearInterval(this.timer);
	}
}

module.exports = Iot4Poll;