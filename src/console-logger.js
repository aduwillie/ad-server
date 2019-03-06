const EventEmitter = require('events');

class ConsoleLogger extends EventEmitter {
    constructor() {
        this.on('log', (message) => {
            console.log(message);
        });
        this.on('warn', (message) => {
            console.warn(message);
        });
        this.on('error', (message) => {
            console.error(message);
        });
    }
}

module.exports = ConsoleLogger;
