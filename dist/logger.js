"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publisher_1 = require("./publisher");
const constants_1 = require("./constants");
class AdLogger {
    constructor() {
        this.subscribe = (topic, func) => {
            return this.publisher.subscribe(topic, func);
        };
        this.info = (message) => {
            this.publisher.publish('*', message);
            return this.publisher.publish(constants_1.SYSTEM_TOPICS.INFO, message);
        };
        this.warn = (message) => {
            this.publisher.publish('*', message);
            return this.publisher.publish(constants_1.SYSTEM_TOPICS.WARN, message);
        };
        this.error = (message) => {
            this.publisher.publish('*', message);
            return this.publisher.publish(constants_1.SYSTEM_TOPICS.ERROR, message);
        };
        this.log = (message) => {
            this.publisher.publish('*', message);
            return this.publisher.publish(constants_1.SYSTEM_TOPICS.LOG, message);
        };
        this.all = (message) => {
            return this.publisher.publish('*', message);
        };
        this.publisher = new publisher_1.default();
        this.publisher.subscribe('*', (message) => message);
        this.publisher.subscribe(constants_1.SYSTEM_TOPICS.INFO, (message) => message);
        this.publisher.subscribe(constants_1.SYSTEM_TOPICS.WARN, (message) => message);
        this.publisher.subscribe(constants_1.SYSTEM_TOPICS.ERROR, (message) => message);
        this.publisher.subscribe(constants_1.SYSTEM_TOPICS.LOG, (message) => message);
    }
}
exports.default = AdLogger;
