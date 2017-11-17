import * as url from 'url';
import * as fs from 'fs';
import { IRequest, IResponse } from './interfaces';
import { STATIC_FILE_TYPES } from './constants';

export const readFile = (filePath: string) => {
    try {
        return fs.readFileSync(filePath, { encoding: 'utf-8' });
    } catch (error) {
        throw new Error(`File: ${filePath} doesn't exist`);
    }
};

export const createRequestObj = (request: any): IRequest => {
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
            response.writeHead(200, { 'Content-Type': mimeType || 'text/html' });
            response.end(readFile(obj.usePublicDirectory ? publicDirectory + filename : filename));
        },
        send: (data: any) => response.end(data),
        sendJSON: (data: any) => {
            response.writeHead(200, { 'ContentT-Type': 'application/json' });
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
    let type = 'text/plain';
    for (let i = 0; i < STATIC_FILE_TYPES.length; i++) {
        if (filename.endsWith(STATIC_FILE_TYPES[i])) {
            type = STATIC_FILE_TYPES[i];
            break;
        }
    }
    return type;
};

export const getMimeType = (filename: string) => {
    switch (filename) {
        case '.txt':
            return 'text/plain';
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        case '.jpeg':
            return 'image/jpeg';
        case '.bmp':
            return 'image/bmp';
        case '.webp':
            return 'image/webp';
        case '.midi':
            return 'audio/midi';
        case '.webm':
            return 'audio/webm';
        case '.wav':
            return 'audio/wav';
        case '.mp4':
        case '.mp3':
            return 'audio/mp3';
        case '.pdf':
            return 'application/pdf';
        case '.xml':
            return 'application/xml';
        case '.json':
            return 'application/json';
        case '.woff':
            return 'application/font-woff';
        case '.ttf':
            return 'application/font-ttf';
        case '.eot':
            return 'application/vnd.ms-fontobject';
        case '.otf':
            return 'application/font-otf';
        case '.svg':
            return 'application/image/svg+xml';
        default:
            'text/plain';
    }
};
