import { Configuration } from 'oidc-provider'

import clients from './clients'
import { AccountRepository } from '../repository'

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
      ack: 'draft-06',
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
  }

} as Configuration;