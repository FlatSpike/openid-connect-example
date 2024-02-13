import { Issuer, Client, IssuerMetadata } from 'openid-client'

import client from './client.js'

const ISSUER = 'http://sso.auth.ru:3000/oidc'

class Oidc {

  private _client: Client | null

  constructor() {
    this._client = null
  }

  get client(): Client {
    if (this._client == null) throw Error("Client was not discovered yet")
    return this._client
  }

  async discover(): Promise<IssuerMetadata> {
    const issuer = await Issuer.discover(ISSUER)
    this._client = new issuer.Client(client)
    return issuer.metadata
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