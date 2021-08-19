import { Express } from 'express'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import path from 'path'

import { Oidc } from '../oidc'
import routes from './routes'

import { AccountRepository } from '../repository'

declare global {
  namespace Express {
    interface Request {
      accounts: AccountRepository
    }
  }
}

export default async (): Promise<Express> => {
  const oidc = new Oidc()
  const isserMetadata = await oidc.discover()
  console.log(`Successfully dicevered issuer: ${isserMetadata.issuer}`)
  
  const app = express()

  app.use(morgan('tiny'))

  app.set('view engine', 'pug')
  app.set('views', path.resolve(__dirname, 'views'));
  
  app.use((req, res, next) => {
    req.accounts = new AccountRepository()
    return next()
  })

  // for development properties disable cash for all requests
  // in production it should be set more preciecly
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(session({ secret: 'some secret' }))

  app.use(oidc.middleware())

  app.use('/', routes)

  return app
}