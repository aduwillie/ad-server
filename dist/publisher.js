"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Publisher {
    constructor() {
        this.subscribe = (topic, subscriber) => {
            if (!this.topics[topic]) {
                this.topics[topic] = [];
            }
            let token = utils_1.randomString(5);
            this.topics[topic].push({
                token,
                func: subscriber,
            });
            return token;
        };
        this.unsubscribe = (token) => {
            for (let topic in this.topics) {
                for (let i = 0; i < this.topics[topic].length; i++) {
                    if (this.topics[topic][i].token === token) {
                        this.topics[topic].splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        };
        this.publish = (topic, message) => {
            if (!this.topics[topic]) {
                return false;
            }
            const subscribers = this.topics[topic];
            if (subscribers && subscribers.length) {
                for (let i = 0; i < subscribers.length; i++) {
                    subscribers[i].func(message);
                }
                return true;
            }
            return false;
        };
        this.topics = {};
    }
}
exports.default = Publisher;
