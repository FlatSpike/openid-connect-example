import { ClientMetadata } from 'openid-client'

export default {
  client_id: 'client_notes',
  client_secret: 'client_notes_secret',
  redirect_uris: ['http://sso.notes.ru/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.notes.ru/oidc/logout/cb']
} as ClientMetadata