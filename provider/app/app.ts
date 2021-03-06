import path from 'path'
import express from 'express'
import { Provider } from 'oidc-provider'

import { oidc } from '../oidc'
import { AccountRepository } from '../repository'
import { oidc as oicdRoutes } from './routes'

const app = express()

declare global {
  namespace Express {
    interface Request {
      oidc: Provider,
      accounts: AccountRepository
    }
  }
}

app.use(express.json())
app.use(express.urlencoded())

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use((req, res, next) => {
  req.oidc = oidc
  req.accounts = AccountRepository
  next()
})

app.use('/oidc', oicdRoutes)
app.use('/oidc', oidc.callback());

export default app