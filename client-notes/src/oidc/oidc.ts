import { Issuer, Client, IssuerMetadata } from 'openid-client'

import client from './client.js'

const ISSUER = 'http://sso.auth.ru/oidc'

class Oidc {

  private _client: Client | null

  constructor() {
    this._client = null
  }

  async discover(): Promise<Client> {
    if (this._client == null) {
      const issuer = await Issuer.discover(ISSUER)
      this._client = new issuer.Client(client)
    }
    return this._client
  }

  middleware() {
    return async (req, res, next) => {
      req.oidc = this
      return next()
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      oidc: Oidc
    }
  }
}

export default Oidc