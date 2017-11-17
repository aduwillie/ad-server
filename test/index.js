const AdServer = require('../dist/server');
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
