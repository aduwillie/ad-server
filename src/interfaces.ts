export interface IServerOptions {
    port: number;
    publicDirectory?: string;
    ssl: {
        key: string;
        cert: string;
    };
}

export interface IRequest {
    url: string;
    query: string;
    path: string;
    method: string;
}

export interface IResponse {
    send: (data: any) => void;
    sendJSON: (data: any) => void;
    sendFile: (filePath: string) => void;
    redirect: (redirectUrl: string) => void;
}

export interface IRequestHandler {
    (request: IRequest, response: IResponse): void;
}

export interface IRouteOptions {
    path: string;
    method: string;
    handler: IRequestHandler;
    [propname: string]: any;
}

export interface IServer {
    addPort: (port: number) => IServer;
    addPublicDirectory: (path: string) => IServer;
    addRoute: (routOptions: IRouteOptions) => IServer;
    listen: () => IServer;
}
