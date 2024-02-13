import { ClientMetadata } from 'oidc-provider'

export default {
  client_id: 'clinet_info',
  client_secret: 'client_info_secret',
  redirect_uris: ['http://sso.info.ru:3002/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.info.ru:3002/oidc/logout/cb'],
  backchannel_logout_uri: 'http://sso.info.ru:3002/oidc/logout/backchannel/cb',
  backchannel_logout_session_required: true
} as ClientMetadata