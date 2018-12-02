import * as url from 'url';
import * as fs from 'fs';
import * as queryString from 'querystring';
import { IRequest, IResponse, IExtendedRequest } from './interfaces';
import { STATIC_FILE_TYPES, MIME_TYPE_MAPPING } from './constants';
import { IncomingMessage } from 'http';

export const readFile = (filePath: string) => {
    try {
        return fs.readFileSync(filePath, { encoding: 'utf-8' });
    } catch (error) {
        throw new Error(`File: ${filePath} doesn't exist`);
    }
};

export const createRequestObj = (request: IncomingMessage): IRequest => {
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

export const createResponseObj = (response: any, publicDirectory: string = ''): IResponse => {
    const obj: IResponse = {
        sendFile: (filename: string, mimeType?: string) => {
            response.writeHead(200, { 'Content-Type': mimeType || MIME_TYPE_MAPPING['.html'] });
            response.end(readFile(obj.usePublicDirectory ? `${publicDirectory}/${filename}` : filename));
        },
        send: (data: any) => response.end(data),
        sendJSON: (data: any) => {
            response.writeHead(200, { 'ContentT-Type': MIME_TYPE_MAPPING['.json'] });
            response.end(JSON.stringify(data));
        },
        redirect: (redirectUrl: string) => {
            console.log('In redirect');
            response.writeHead(301, { Location: redirectUrl });
            response.end();
        }
    };
    return obj;
};

export const isStaticFile = (filename: string) => {
    let matched = false;
    for (let i = 0; i < STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(STATIC_FILE_TYPES[i])) {
            matched = true;
            break;
        }
    }
    return matched;
};

export const getFileType = (filename: string) => {
    let type = '.txt';
    for (let i = 0; i < STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(STATIC_FILE_TYPES[i])) {
            type = STATIC_FILE_TYPES[i];
            break;
        }
    }
    return type;
};

export const getMimeType = (filename: string) => {
    if (filename) {
        return 'text/plain';
    }
    return MIME_TYPE_MAPPING[filename];
};

export const parseJson = (input: string) => {
    try {
        return JSON.parse(input) || {};
    } catch (error) {
        return {};
    }
}

export const parseQueryString = (input: string) => {
    try {
        return queryString.parse(input) || {};
    } catch (error) {
        return {};
    }
}
