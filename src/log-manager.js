const EventEmitter = require('events');

class LogManager extends EventEmitter {
    constructor() {
        super();
        this.loggers = new Set();
        this.on('log', (message) => {
           this.loggers.forEach(logger => logger.log(message));
        });
        this.on('warn', (message) => {
            this.loggers.forEach(logger => logger.warn(message));
        });
        this.on('error', (message) => {
            this.loggers.forEach(logger => logger.error(message));
        });
    }

    addLogger(logger) {
        this.loggers.add(logger);
    }

    disableConsole() {
        this.loggers.delete(console);
    }
}

module.exports = LogManager;
