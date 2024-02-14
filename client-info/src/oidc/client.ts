import { ClientMetadata } from 'openid-client'

export default {
  client_id: 'client_info',
  client_secret: 'client_info_secret',
  redirect_uris: ['http://sso.info.ru/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.info.ru/oidc/logout/cb']
} as ClientMetadata