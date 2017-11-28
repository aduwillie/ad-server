const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/server.ts'),
    output: {
        filename: './dist/server.js',
    },
    target: 'node',
    module: {
        rules: [
            { test: /\.ts/, use: 'ts-loader' }
        ]
    },
    context: __dirname,
    node: {
        __filename: true,
    },
    resolve: {
        extensions: [ '.ts' ]
      },
};
