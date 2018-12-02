import { IncomingMessage } from "http";

export interface IServerOptions {
    port: number;
    publicDirectory?: string;
    ssl: {
        key: string;
        cert: string;
    };
    serveStaticFiles: boolean;
    allowCors: boolean;
}

export interface IRequest {
    url: string;
    query: string;
    path: string;
    method: string;
    body?: string | object | JSON;
    queryString?: any;
}

export interface IResponse {
    usePublicDirectory?: boolean;

    send: (data: any) => void;
    sendJSON: (data: any) => void;
    sendFile: (filePath: string) => void;
    redirect: (redirectUrl: string) => void;
}

export interface IRequestHandler {
    (request: IRequest, response: IResponse): void;
}

export interface IRouteHandlerOptions {
    usePublicDirectory: boolean;
}

export interface IRouteOptions {
    path: string;
    method: string;
    handler: IRequestHandler;
    options: IRouteHandlerOptions;
}

export interface IServer {
    addPort: (port: number) => IServer;
    addPublicDirectory: (path: string) => IServer;
    addRoute: (routOptions: IRouteOptions) => IServer;
    listen: () => IServer;
}

export interface IExtendedRequest extends IncomingMessage {
    body: string | JSON | Object;
}

export interface IBodyParseResult {
    json: Object,
    qs: {
        [key: string]: string | string[] | undefined;
    };
}
