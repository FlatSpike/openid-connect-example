import { ClientMetadata } from 'oidc-provider'

export default {
  client_id: 'clinet_notes',
  client_secret: 'client_notes_secret',
  redirect_uris: ['http://sso.notes.ru:3001/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.notes.ru:3001/oidc/logout/cb'],
  backchannel_logout_uri: 'http://sso.notes.ru:3001/oidc/logout/backchannel/cb',
  backchannel_logout_session_required: true,
} as ClientMetadata