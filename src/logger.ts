import Publisher from './publisher';
import { IPublisher, ISubscriber, ILogger } from './interfaces';
import { SYSTEM_TOPICS } from './constants';

class AdLogger implements ILogger {
    private publisher: IPublisher;

    constructor() {
        this.publisher = new Publisher();
        this.publisher.subscribe('*', (message) => message);
        this.publisher.subscribe(SYSTEM_TOPICS.INFO, (message) => message);
        this.publisher.subscribe(SYSTEM_TOPICS.WARN, (message) => message);
        this.publisher.subscribe(SYSTEM_TOPICS.ERROR, (message) => message);
        this.publisher.subscribe(SYSTEM_TOPICS.LOG, (message) => message);
    }

    subscribe = (topic: string, func: ISubscriber) => {
        return this.publisher.subscribe(topic, func);
    };

    info = (message: string) => {
        this.publisher.publish('*', message);
        return this.publisher.publish(SYSTEM_TOPICS.INFO, message);
    };

    warn = (message: string) => {
        this.publisher.publish('*', message);
        return this.publisher.publish(SYSTEM_TOPICS.WARN, message);
    };

    error = (message: string) => {
        this.publisher.publish('*', message);
        return this.publisher.publish(SYSTEM_TOPICS.ERROR, message);
    };

    log = (message: string) => {
        this.publisher.publish('*', message);
        return this.publisher.publish(SYSTEM_TOPICS.LOG, message);
    };

    all = (message: string) => {
        return this.publisher.publish('*', message);
    };
}

export default AdLogger;
