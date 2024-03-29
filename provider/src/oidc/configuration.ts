import { Configuration } from 'oidc-provider'

import clients from './clients/index.js'
import jwks from './jwks.js'
import { AccountRepository } from '../repository/index.js'

export default {
  clients: clients,

  claims: {
    openid: ['sub'],
    email: ['email', 'email_verified'],
  },

  interactions: {
    url(ctx, interaction) {
      return `/oidc/interaction/${interaction.uid}`
    }
  },

  features: {
    devInteractions: { enabled: false },

    backchannelLogout: {
      enabled: true
    }
  },

  findAccount: async (ctx, sub, token) => {
    const account = await AccountRepository.findById(sub)
    if (!account) return undefined
  
    return {
      accountId: sub,
      claims: async (use, scope) => {
        return { 
          sub: sub
        }
      },
    }
  },

  renderError: async (ctx, out, error) => {
    console.log(error)
    ctx.res.write(error.message)
  },

  cookies: {
    keys: [ 'cookie secret' ]
  },

  jwks: jwks
} as Configuration;