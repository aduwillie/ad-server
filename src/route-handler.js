const Path = require('path');

const BodyParser = require('./body-parser');
const {
    createResponseObj,
    readFile,
    isStaticFile,
    getMimeType,
    getFileType,
    buildRouteHashKey,
} = require('./utils');

const routeHandler = (request, response, req, publicDirectories = [], routes = new Map(), logManager) => {
    if (isStaticFile(req.path)) {
        response.writeHead(200, { 'Content-Type': getMimeType(getFileType(req.path)) });
        const pathToFile = publicDirectories
            .map(d => d ? d : __dirname)
            .map(d => Path.resolve(d, req.slice(1)));
        response.end(readFile(pathToFile));
    } else {
        const res = createResponseObj(response, publicDirectories);
        const routeHashKey = buildRouteHashKey(req.method, req.path);
        const routeMatch = routes.get(routeHashKey);
        if (!routeMatch) {
            const errorMsg = `No handler found for request: ${request}`;
            if (logManager) logManager.emit('error', errorMsg);
            response.writeHead(404);
            response.end();
        }
        if (req.method === 'POST' || req.method === 'PUT') {
            BodyParser(request, (body) => {
                req.body = body;
                routeMatch.handler(req, res);
            });
        } else routeMatch.handler(req, res);
    }
}

module.exports = routeHandler;
