const Buffer = require('buffer');

const {
    parseJson,
    parseQueryString,
} = require('./utils');

const BodyParser = (request, callback) => {
    let body = [];
    request
        .on('data', (chunk) => {
            body.push(chunk);
        })
        .on('end', () => {
            const result = Buffer.concat(body).toString();
            callback({
                json: parseJson(result),
                qs: parseQueryString(result),
                raw: result,
            });
        });
};

module.exports = BodyParser;
