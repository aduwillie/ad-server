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

Setting up `ad-server` is very easy. The server could be setup with configurations passed.
```
const AdServer = require('ad-server');
const config = {
    port: 4000,
};
const server = new AdServer(config);
server.start()
```

`ad-server` could also be set up using a chain of method calls. All these method calls are optional and should only be used when the result is desired.
```
const AdServer = require('ad-server');
const Path = require('path');

const server = new AdServer();
server
    .setPort(4000)
    .addConsoleLogger()
    .addPublicDirectory(Path.resolve(__dirname, 'public_directory'))
    .allowCors()
    .start();
```

Routes can easily be added using the `addRoute` or `addRoutes` api. Common practice is to export route objects in separate files and use the `addRoutes` api to register all such routes to `ad-server`.
```
server.addRoute({
    path: '/',
    method: 'GET',
    handler: (req, res) => {
        res.sendFile('index.html');
    }, 
});

server.addRoutes([
    {
        path: '/',
        method: 'GET',
        handler: (req, res) => {
            res.sendFile('index.html');
        }, 
    },
    {
        path: '/',
        method: 'GET',
        handler: (req, res) => {
            res.sendFile('index.html');
        }, 
    }
])
```

Finally, server can be started and stopped using `server.start()` and `server.stop` method calls. `server.stop` is particularly useful in testing.
```
server.start();
server.stop();
```

# A working Examaple
```
const AdServer = require('ad-server');
const Path = require('path');

const getFileRoute = {
    path: '/',
    method: 'GET',
    handler: (req, res) => {
        res.sendFile(index.html');
    }, 
};

const getJsonRoute = {
    path: '/json',
    method: 'GET',
    handler: (req, res) => {
        res.sendJSON({ a: 1 });
    }
};

const server = new AdServer({
    port: 3000, 
};
server
    .addPublicDirectory(Path.resolve(__dirname, 'public'))
    .addConsoleLogger()
    .allowCors()
    .addRoutes([getFilesRoute, getJsonRoute]);

server.start();

```
