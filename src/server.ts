import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import AdLogger from './logger';
import { IServer, IServerOptions, IRouteOptions, IExtendedRequest, IRequest, IResponse, IBodyParseResult, ILogger } from './interfaces';
import { createRequestObj, createResponseObj, readFile, isStaticFile, getMimeType, getFileType, parseJson, parseQueryString } from './utils';
import { IncomingMessage, ServerResponse } from 'http';
import { Buffer } from 'buffer';

declare const module: any;

class Server implements IServer {
    private routes: IRouteOptions[];

    public logger: ILogger;

    constructor(private serverOptions: IServerOptions) {
        this.routes = [];
        if (!serverOptions.hasOwnProperty('serveStaticFiles')) this.serverOptions.serveStaticFiles = true;
        if (!serverOptions.hasOwnProperty('allowCors')) this.serverOptions.allowCors = true;
        this.logger = new AdLogger();
    }

    addPublicDirectory = (path: string) => {
        this.serverOptions.publicDirectory = path;
        return this;
    };

    addPort = (port: number) => {
        this.serverOptions.port = port;
        return this;
    };

    addRoute = (routeOptions: IRouteOptions) => {
        this.routes.push(routeOptions);
        return this;
    };

    private parseBody = (request: IncomingMessage, callback: (body: IBodyParseResult) => void) => {
        try {
            let body: Buffer[] = [];
            request
                .on('data', (chunk: Buffer) => {
                    body.push(chunk);
                })
                .on('end', () => {
                    try {
                        const result = Buffer.concat(body).toString();
                        callback({
                            json: parseJson(result),
                            qs: parseQueryString(result),
                        });
                    } catch (error) {
                        callback({
                            json: {},
                            qs: {},
                        });
                    }
                });
        } catch (error) {
            this.logger.error(error.toString());
        }
    };

    private handleRoutes = (req: IRequest, res: IResponse) => {
        try {
            const matchRoutes = this.routes.filter(
                route => route.path === req.path && route.method === req.method
            )[0];
    
            if (matchRoutes.options && matchRoutes.options.usePublicDirectory) res.usePublicDirectory = true;
    
            matchRoutes.handler(req, res);
        } catch (error) {
            this.logger.error(error.toString());
        }
    }

    listen = () => {
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
                
            server.on('request', (request: IncomingMessage, response: ServerResponse) => {
                if (this.serverOptions.allowCors) {
                    // Set up all cors stuffs here
                    response.setHeader('Access-Control-Allow-Origin', '*');
                    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                    response.setHeader('Access-Control-Allow-Credentials', 'true');
                }

                // Set up request error handling
                request.on('error', (err: Error) => this.logger.error(err.toString()));

                // Set up response error handling
                response.on('error', (err: Error) => this.logger.error(err.toString()));

                const req = createRequestObj(request);

                if (isStaticFile(req.path)) {
                    response.writeHead(200, { 'Content-Type': getMimeType(getFileType(req.path)) });
                    const pathToFile = path.resolve(this.serverOptions.publicDirectory || __dirname, req.path.slice(1));
                    response.end(readFile(pathToFile));
                } else {
                    const res = createResponseObj(response, this.serverOptions.publicDirectory);
                    if (this.routes.some(route => route.path === req.path && route.method === req.method)) {
                        if (req.method === 'POST' || req.method === 'PUT') {
                            this.parseBody(request, (body: IBodyParseResult) => {
                                req.body = body;
                                this.handleRoutes(req, res);
                            });
                        } else this.handleRoutes(req, res);
                    } else {
                        response.writeHead(404);
                        response.end();
                    }
                }
            });
            this.serverOptions.port = this.serverOptions.port;
            server.listen(this.serverOptions.port);
            this.logger.info(`Server listening on port ${this.serverOptions.port}`);
            return this;
        } catch (error) {
            this.logger.error(error.toString());
            throw new Error('Could not generate a server object!');
        }
    };
}

module.exports = Server;
