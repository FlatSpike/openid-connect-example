import Provider from 'oidc-provider'

import configuration from './configuration.js'

const oidc = new Provider('http://sso.auth.ru', configuration);

export default oidc