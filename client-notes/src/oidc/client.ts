import { ClientMetadata } from 'openid-client'

export default {
  client_id: 'clinet_notes',
  client_secret: 'client_notes_secret',
  redirect_uris: ['http://sso.notes.ru:3001/oidc/cb'],
  post_logout_redirect_uris: ['http://sso.notes.ru:3001/oidc/logout/cb']
} as ClientMetadata