import Provider from 'oidc-provider'

import configuration from './configuration.js'

const oidc = new Provider('http://sso.auth.ru:3000', configuration);

export default oidc