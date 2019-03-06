const Url =  require('url');
const Fs = require('fs');
const QueryString = require('querystring');
const { STATIC_FILE_TYPES, MIME_TYPE_MAPPING } = require('./constants');

const readFile = (filePath) => {
    if (typeof filePath === 'string') {
        return Fs.readFileSync(filePath, { encoding: 'utf-8' });
    } else if (Array.isArray(filePath)) {
        let validPath;
        for (let i = 0; i < filePath.length; i++) {
            if (Fs.existsSync(filePath[i])) {
                validPath = filePath[i];
                break;
            }
        }
        if (validPath) return Fs.readFileSync(validPath, { encoding: 'utf-8' });
    }
    throw new Error(`File doesn't exist: ${filePath}`);
};

const createRequestObj = (request) => {
    if (request.url) {
        const parsedUrl = Url.parse(request.url, true);
        if (parsedUrl) {
            console.log(`Serving requests on route: ${parsedUrl.path} -- ${request.method}`);
            return {
                url: request.url,
                query: parsedUrl.query,
                path: parsedUrl.pathname || '',
                method: request.method.toUpperCase() || 'GET',
                headers: request.headers,
            };
        }
        throw new Error(`Cannot parse the request url`);
    }
    throw new Error(`No url related in request`);
};

const createResponseObj = (response, publicDirectories = []) => {
    const obj = {
        send: (data) => {
            response.writeHead(200, {'Content-Type': MIME_TYPE_MAPPING['.*'] })
            response.end(data)
        },
        sendFile: (filename, mimeType) => {
            response.writeHead(200, { 'Content-Type': mimeType || MIME_TYPE_MAPPING['.txt'] });
            const potentialPaths = publicDirectories.map(p => `${p}/${filename}`);
            response.end(readFile(potentialPaths));
        },
        sendJSON: (data) => {
            response.writeHead(200, { 'ContentT-Type': MIME_TYPE_MAPPING['.json'] });
            response.end(JSON.stringify(data));
        },
        sendPage: (pageName) => {
            obj.sendFile(`${pageName}.html`, '.html');
        },
        redirect: (redirectUrl) => {
            response.writeHead(301, { Location: redirectUrl });
            response.end();
        }
    };
    return obj;
};

const isStaticFile = (filename) => {
    let matched = false;
    for (let i = 0; i < STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(STATIC_FILE_TYPES[i])) {
            matched = true;
            break;
        }
    }
    return matched;
};

const getFileType = (filename) => {
    let type = '.txt';
    for (let i = 0; i < STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(STATIC_FILE_TYPES[i])) {
            type = STATIC_FILE_TYPES[i];
            break;
        }
    }
    return type;
};

const getMimeType = (filename) => filename ? MIME_TYPE_MAPPING[filename] : MIME_TYPE_MAPPING['.*'];

const parseJson = (input) => JSON.parse(input) || {};

const parseQueryString = (input) => QueryString.parse(input) || {};

const randomString = (length) => {
    let text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const buildRouteHashKey = (method, path) => `${method}-${path}`
    .replace(/(?<=(.+))\/(?!(.+))/gi, '').toLowerCase();

module.exports = {
    readFile,
    createRequestObj,
    createResponseObj,
    isStaticFile,
    getFileType,
    getMimeType,
    parseJson,
    parseQueryString,
    randomString,
    buildRouteHashKey,
};
