import { ISubscriber, ISubscription, IPublisher } from './interfaces';
import { randomString } from './utils';

class Publisher implements IPublisher {
    private topics: { [topic: string]: ISubscription[] };

    constructor() {
        this.topics = {};
    }

    subscribe = (topic: string, subscriber: ISubscriber): string => {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        let token = randomString(5);
        this.topics[topic].push({
            token,
            func: subscriber,
        });
        return token;
    };

    unsubscribe = (token: string): Boolean => {
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

    publish = (topic: string, message: string): Boolean => {
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
}

export default Publisher;
