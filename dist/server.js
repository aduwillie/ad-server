"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const path = require("path");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const buffer_1 = require("buffer");
class Server {
    constructor(serverOptions) {
        this.serverOptions = serverOptions;
        this.addPublicDirectory = (path) => {
            this.serverOptions.publicDirectory = path;
            return this;
        };
        this.addPort = (port) => {
            this.serverOptions.port = port;
            return this;
        };
        this.addRoute = (routeOptions) => {
            this.routes.push(routeOptions);
            return this;
        };
        this.parseBody = (request, callback) => {
            try {
                let body = [];
                request
                    .on('data', (chunk) => {
                    body.push(chunk);
                })
                    .on('end', () => {
                    try {
                        const result = buffer_1.Buffer.concat(body).toString();
                        callback({
                            json: utils_1.parseJson(result),
                            qs: utils_1.parseQueryString(result),
                        });
                    }
                    catch (error) {
                        callback({
                            json: {},
                            qs: {},
                        });
                    }
                });
            }
            catch (error) {
                this.logger.error(error.toString());
            }
        };
        this.handleRoutes = (req, res) => {
            try {
                const matchRoutes = this.routes.filter(route => route.path === req.path && route.method === req.method)[0];
                if (matchRoutes.options && matchRoutes.options.usePublicDirectory)
                    res.usePublicDirectory = true;
                matchRoutes.handler(req, res);
            }
            catch (error) {
                this.logger.error(error.toString());
            }
        };
        this.listen = () => {
            try {
                if (!this.serverOptions.port) {
                    throw new Error('valid PORT not set!');
                }
                const server = this.serverOptions.ssl
                    ? https.createServer({
                        key: this.serverOptions.ssl.key,
                        cert: this.serverOptions.ssl.cert
                    })
                    : http.createServer();
                server.on('request', (request, response) => {
                    if (this.serverOptions.allowCors) {
                        // Set up all cors stuffs here
                        response.setHeader('Access-Control-Allow-Origin', '*');
                        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                        response.setHeader('Access-Control-Allow-Credentials', 'true');
                    }
                    // Set up request error handling
                    request.on('error', (err) => this.logger.error(err.toString()));
                    // Set up response error handling
                    response.on('error', (err) => this.logger.error(err.toString()));
                    const req = utils_1.createRequestObj(request);
                    if (utils_1.isStaticFile(req.path)) {
                        response.writeHead(200, { 'Content-Type': utils_1.getMimeType(utils_1.getFileType(req.path)) });
                        const pathToFile = path.resolve(this.serverOptions.publicDirectory || __dirname, req.path.slice(1));
                        response.end(utils_1.readFile(pathToFile));
                    }
                    else {
                        const res = utils_1.createResponseObj(response, this.serverOptions.publicDirectory);
                        if (this.routes.some(route => route.path === req.path && route.method === req.method)) {
                            if (req.method === 'POST' || req.method === 'PUT') {
                                this.parseBody(request, (body) => {
                                    req.body = body;
                                    this.handleRoutes(req, res);
                                });
                            }
                            else
                                this.handleRoutes(req, res);
                        }
                        else {
                            response.writeHead(404);
                            response.end();
                        }
                    }
                });
                this.serverOptions.port = this.serverOptions.port;
                server.listen(this.serverOptions.port);
                this.logger.info(`Server listening on port ${this.serverOptions.port}`);
                return this;
            }
            catch (error) {
                this.logger.error(error.toString());
                throw new Error('Could not generate a server object!');
            }
        };
        this.routes = [];
        if (!serverOptions.hasOwnProperty('serveStaticFiles'))
            this.serverOptions.serveStaticFiles = true;
        if (!serverOptions.hasOwnProperty('allowCors'))
            this.serverOptions.allowCors = true;
        this.logger = new logger_1.default();
    }
}
module.exports = Server;
