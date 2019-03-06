const Sinon = require('sinon');
const Path = require('path');

const AdServer = require('../src/server');
const { SERVER_STATUS, DEFAULT_SERVER_CONFIG } = require('../src/constants');

describe('Ad server', () => {
    beforeEach(() => {
        this.server;
        this.sandbox = Sinon.createSandbox();
    });

    afterEach(() => {
        if (this.server) {
            this.server.stop();
        }
        this.sandbox.restore();
    });

    it('should start/stop with server configs provided', () => {
        const serverConfig = {
            port: 4000,
            publicDirectories: [
                Path.resolve(__dirname, 'public_directory'),
            ],
        };
        this.server = new AdServer(serverConfig);
        expect(this.server.status).toEqual(SERVER_STATUS.INITIALIZING);
        expect(this.server.port).toEqual(serverConfig.port);
        this.server.start();
        expect(this.server.status).toEqual(SERVER_STATUS.STARTED);
        this.server.stop();
        expect(this.server.status).toEqual(SERVER_STATUS.STOPPED);
    });
    it('should start/stop without providing server configs', () => {
        this.server = new AdServer();
        expect(this.server.status).toEqual(SERVER_STATUS.INITIALIZING);
        expect(this.server.port).toEqual(DEFAULT_SERVER_CONFIG.port);
        this.server.addPublicDirectory(Path.resolve(__dirname, 'public_directory'));
        expect(Array.isArray(this.server.publicDirectories)).toBeTruthy();
        this.server.start();
        expect(this.server.status).toEqual(SERVER_STATUS.STARTED);
        this.server.stop();
        expect(this.server.status).toEqual(SERVER_STATUS.STOPPED);
    });
    it('should have no log manager configured by default', () => {
        this.server = new AdServer();
        expect(this.server.status).toEqual(SERVER_STATUS.INITIALIZING);
        expect(this.server.logManager.loggers.size).toEqual(0);
        this.server.addConsoleLogger();
        expect(this.server.logManager.loggers.size).toEqual(1);
        this.server.start();
        expect(this.server.status).toEqual(SERVER_STATUS.STARTED);
        this.server.stop();
        expect(this.server.status).toEqual(SERVER_STATUS.STOPPED);
    });
});
