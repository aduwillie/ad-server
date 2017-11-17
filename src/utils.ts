import * as url from 'url';
import * as fs from 'fs';
import {IRequest, IResponse} from './interfaces';

export const readFile = (filePath: string) => {
    try {
        return fs.readFileSync(filePath);
    } catch (error) {
        throw new Error(`File: ${filePath} doesn't exist`);
    }
}

export const createRequestObj = (request: any): IRequest => {
    if(request.url) {
        const parsedUrl = url.parse(request.url, true);
        if(parsedUrl) {
            return {
                url: request.url,
                query: parsedUrl.query,
                path: parsedUrl.pathname || '',
                method: request.method || 'GET',
            };
        }
        throw new Error(`Cannot parse the request url`);
    }
    throw new Error(`No url related in request`);
}

export const createResponseObj = (response: any): IResponse => {
    return {
        sendFile: (filename: string) => {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(readFile(filename));
        },
        send: (data: any) => response.end(data),
        sendJSON: (data: any) => {
            response.writeHead(200, { 'ContentT-Type': 'application/json' });
            response.end(JSON.stringify(data));
        },
        redirect: (redirectUrl: string) => {
            console.log('In redirect');
            response.writeHead(301, { 'Location': redirectUrl });
            response.end();
        }
    };
}
