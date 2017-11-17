import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as chalk from 'chalk';
import { IServer, IServerOptions, IRouteOptions } from './interfaces';

import { 
    createRequestObj, 
    createResponseObj,
    readFile,
    isStaticFile, 
    getMimeType,
    getFileType,
} from './utils';

declare const module: any;

class Server implements IServer {
    private routes: IRouteOptions[];

    constructor(private serverOptions: IServerOptions) {
        this.routes = [];
        if(!serverOptions.hasOwnProperty('serveStaticFiles')) this.serverOptions.serveStaticFiles = true;
        if(!serverOptions.hasOwnProperty('allowCors')) this.serverOptions.allowCors = true;
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

    listen = () => {
        const server = this.serverOptions.ssl
            ? https.createServer({
                  key: this.serverOptions.ssl.key,
                  cert: this.serverOptions.ssl.cert
              })
            : http.createServer();
        server.on('request', (request, response) => {
            if(this.serverOptions.allowCors) {
                // Set up all cors stuffs here
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                response.setHeader('Access-Control-Allow-Credentials', true);
            }

            const req = createRequestObj(request);

            if (isStaticFile(req.path)) {
                response.writeHead(200, { 'Content-Type': getMimeType(getFileType(req.path)) });
                const pathToFile = path.resolve(this.serverOptions.publicDirectory, req.path.slice(1));
                response.end(readFile(pathToFile));
            } else {
                const res = createResponseObj(response, this.serverOptions.publicDirectory);
                if (this.routes.some(route => route.path === req.path && route.method === req.method)) {
                    const matchRoutes = this.routes.filter(
                        route => route.path === req.path && route.method === req.method
                    )[0];

                    if (matchRoutes.options && matchRoutes.options.usePublicDirectory) res.usePublicDirectory = true;

                    matchRoutes.handler(req, res);
                } else {
                    response.writeHead(404);
                    response.end();
                }
            }
        });
        this.serverOptions.port = this.serverOptions.port || server.address().port;
        server.listen(this.serverOptions.port);
        console.log(`Server listening on port ${this.serverOptions.port}`);
        return this;
    };
}

module.exports = Server;
