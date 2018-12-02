"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const fs = require("fs");
const queryString = require("querystring");
const constants_1 = require("./constants");
exports.readFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, { encoding: 'utf-8' });
    }
    catch (error) {
        throw new Error(`File: ${filePath} doesn't exist`);
    }
};
exports.createRequestObj = (request) => {
    if (request.url) {
        const parsedUrl = url.parse(request.url, true);
        if (parsedUrl) {
            console.log(`Serving requests on route: ${parsedUrl.path} -- ${request.method}`);
            return {
                url: request.url,
                query: parsedUrl.query,
                path: parsedUrl.pathname || '',
                method: request.method || 'GET'
            };
        }
        throw new Error(`Cannot parse the request url`);
    }
    throw new Error(`No url related in request`);
};
exports.createResponseObj = (response, publicDirectory = '') => {
    const obj = {
        sendFile: (filename, mimeType) => {
            response.writeHead(200, { 'Content-Type': mimeType || constants_1.MIME_TYPE_MAPPING['.html'] });
            response.end(exports.readFile(obj.usePublicDirectory ? publicDirectory + filename : filename));
        },
        send: (data) => response.end(data),
        sendJSON: (data) => {
            response.writeHead(200, { 'ContentT-Type': constants_1.MIME_TYPE_MAPPING['.json'] });
            response.end(JSON.stringify(data));
        },
        redirect: (redirectUrl) => {
            console.log('In redirect');
            response.writeHead(301, { Location: redirectUrl });
            response.end();
        }
    };
    return obj;
};
exports.isStaticFile = (filename) => {
    let matched = false;
    for (let i = 0; i < constants_1.STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(constants_1.STATIC_FILE_TYPES[i])) {
            matched = true;
            break;
        }
    }
    return matched;
};
exports.getFileType = (filename) => {
    let type = '.txt';
    for (let i = 0; i < constants_1.STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(constants_1.STATIC_FILE_TYPES[i])) {
            type = constants_1.STATIC_FILE_TYPES[i];
            break;
        }
    }
    return type;
};
exports.getMimeType = (filename) => {
    if (filename) {
        return 'text/plain';
    }
    return constants_1.MIME_TYPE_MAPPING[filename];
};
exports.parseJson = (input) => {
    try {
        return JSON.parse(input) || {};
    }
    catch (error) {
        return {};
    }
};
exports.parseQueryString = (input) => {
    try {
        return queryString.parse(input) || {};
    }
    catch (error) {
        return {};
    }
};
