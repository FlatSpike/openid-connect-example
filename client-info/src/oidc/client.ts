import { ClientMetadata } from 'openid-client'

export default {
  client_id: 'clinet_info',
  client_secret: 'client_info_secret',
  redirect_uris: ['http://sso.info.ru:3002/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.info.ru:3002/oidc/logout/cb']
} as ClientMetadata