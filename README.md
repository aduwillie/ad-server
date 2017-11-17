# ad-server
A simple node.js server

## Installation
```
// Using yarn
yarn add ad-server
//Using npm 
npm install ad-server
```

## Usage

Setting up `ad-server` is very easy.
```
const AdServer = require('ad-server');
const Server = new AdServer({ port: 3000 });
```

The server options are not only limited to specifying the port
```
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
```

Routes can easily be added using the `addRoute` api
```
Server.addRoute({
    path: '/',
    method: 'GET',
    handler: (req, res) => {
        res.sendFile(__dirname + '/index.html');
    }, 
});
```

Finally, requests can be listened to by using the `listen` api
```
Server.listen();
```

# A working Examaple
```
const AdServer = require('ad-server');
const path = require('path');

const Server = new AdServer({
    port: 3000, 
    publicDirectory: path.resolve(__dirname, 'public') 
});

Server.addRoute({
    path: '/',
    method: 'GET',
    handler: (req, res) => {
        res.sendFile(__dirname + '/index.html');
    }, 
});

Server.addRoute({
    path: '/api',
    method: 'POST',
    handler: (req, res) => {
        res.sendJSON({ succeeded: true });
    }
});

Server.addRoute({
    path: '/public',
    method: 'GET',
    handler: (req, res) => {
        res.sendFile('/index.html');
    },
    options: {
        usePublicDirectory: true
    },
});

Server.listen();

```
