import { ClientMetadata } from 'oidc-provider'

export default {
  client_id: 'client_notes',
  client_secret: 'client_notes_secret',
  redirect_uris: ['http://sso.notes.ru/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.notes.ru/oidc/logout/cb'],
  backchannel_logout_uri: 'http://sso.notes.ru/oidc/logout/backchannel/cb',
  backchannel_logout_session_required: true,
} as ClientMetadata