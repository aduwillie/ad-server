const Http = require('http');
const Https = require('https');
const Fs = require('fs');
const Path = require('path');

const RouteValidator = require('./route-validator');
const RouteHandler = require('./route-handler');
const LogManager = require('./log-manager');
const { 
    SERVER_STATUS, 
    DEFAULT_SERVER_CONFIG 
} = require('./constants');
const {
    createRequestObj,
    buildRouteHashKey,
} = require('./utils');
const { setCorsResponseHeaders } = require('./cors');

class AdServer {
    constructor(serverConfig) {
        this.port = (serverConfig && serverConfig.port) || DEFAULT_SERVER_CONFIG.port;
        this.publicDirectories = (serverConfig && serverConfig.publicDirectories) || [];
        this.routes = new Map();
        this.routeValidator = new RouteValidator();
        this.logManager = new LogManager();
        this.sslOptions = (serverConfig && serverConfig.sslOptions) || undefined;
        this.allowCors = (serverConfig && serverConfig.allowCors) || false;
        this.status = SERVER_STATUS.INITIALIZING;
    }

    addConsoleLogger() {
        this.logManager.addLogger(console);
    }

    addPublicDirectory(path = '') {
        if (!Fs.existsSync(path)) {
            const errorMsg = `Specified path does not exist: ${path}`;
            this.logManager.emit('error', errorMsg);
            throw new Error(errorMsg);
        }
        this.publicDirectories.push(path);
        return this;
    }

    addPublicDirectories(paths = []) {
        if (!Array.isArray(path)) {
            const errorMsg = `Specified paths should be an array: ${paths}`;
            this.logManager.emit('error');
            throw new Error(errorMsg);
        }
        paths.forEach(path => this.addPublicDirectory(path));
        return this;
    }

    addRoute(route) {
        if (!this.routeValidator.validate(route)) {
            const errorMsg = this.routeValidator.errorMessage;
            this.logManager.emit('error', errorMsg);
            throw new Error(errorMsg);
        }
        const hashKey = buildRouteHashKey(route.method, route.path);
        if (this.routes.has(hashKey)) {
            const errorMsg = `Specified route has already been added: ${route}`;
            this.logManager.emit('error', errorMsg);
            throw new Error(errorMsg);
        }
        this.routes.set(hashKey, route);
        return this;
    }

    addRoutes(routes = []) {
        if (!Array.isArray(route)) {
            const errorMsg = `Specified routes should be an array: ${routes}`;
            this.logManager.emit('error', errorMsg);
            throw new Error(errorMsg);
        }
        routes.forEach(route => this.addRoute(route));
    }

    addSsl(key, cert) {
        if (!key || !cert) {
            const errorMsg = `Invalid SSL config passed: ${key} ${cert}`;
            this.logManager.emit('error', errorMsg);
            throw new Error(errorMsg);
        }
        this.sslOptions = {
            key,
            cert,
        };
    }

    allowCors() {
        this.allowCors = true;
    }

    inject(config) {
        const hashKey = buildRouteHashKey(config.method, config.path);

    }

    setPort(port) {
        if (typeof port !== 'number') throw new Error('Port is a number.');
        this.port = port;
        return this;
    }

    start() {
        const server = this.sslOptions
            ? Https.createServer({
                key: this.sslOptions.key,
                cert: this.sslOptions.cert
            })
            : Http.createServer();

        this.server = require('http-shutdown')(server);

        this.server.on('request', (request, response) => {
            if (this.allowCors) setCorsResponseHeaders(response);

            // Set up request error handling
            request.on('error', (err) => this.logManager.emit('error', err));
            // Set up response error handling
            response.on('error', (err) => this.logManager.emit('error', err));

            const req = createRequestObj(request);

            RouteHandler(request, response, req, this.publicDirectories, this.routes, this.logManager);
        });
        this.server.listen(this.port);
        this.status = SERVER_STATUS.STARTED;
        this.logManager.emit('log', `Server listening on port ${this.port}`);
        return this;
    }

    stop(callback) {
        this.logManager.emit('Shutting down your Ad Server...');
        this.server.shutdown();
        this.status = SERVER_STATUS.STOPPED;
        if (typeof callback === 'function') callback();
    }
}

module.exports = AdServer;
