const STATIC_FILE_TYPES = [
    '.txt',
    '.html',
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.bmp',
    '.webp',
    '.midi',
    '.webm',
    '.wav',
    '.mp4',
    '.mp3',
    '.pdf',
    '.xml',
    '.json',
    '.woff',
    '.tty',
    '.eof',
    '.otf',
    '.svg',
];

const MIME_TYPE_MAPPING = {
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.midi': 'audio/midi',
    '.webm': 'audio/webm',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mp3',
    '.pdf': 'application/pdf',
    '.xml': 'application/xml',
    '.json': 'application/json',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
    '.*': 'application/octet-stream',
};

const SYSTEM_TOPICS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    LOG: 'log',
};

const SERVER_STATUS = {
    INITIALIZING: 'initialize',
    STARTED: 'started',
    STOPPED: 'stopped'
};

const DEFAULT_SERVER_CONFIG = {
    port: 3555,
    allowCors: false,
}

module.exports = {
    STATIC_FILE_TYPES,
    MIME_TYPE_MAPPING,
    SYSTEM_TOPICS,
    SERVER_STATUS,
    DEFAULT_SERVER_CONFIG,
};
