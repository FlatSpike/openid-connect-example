"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Provider } = require('oidc-provider');
const configuration = {
    clients: [{
            client_id: 'foo',
            client_secret: 'bar',
            redirect_uris: ['http://localhost:3001/cb'],
        }],
};
const oidc = new Provider('http://localhost:3000', configuration);
exports.default = oidc;
