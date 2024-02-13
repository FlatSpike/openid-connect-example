import { Express } from 'express'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import path from 'path'

import { Oidc } from '../oidc/index.js'
import routes from './routes/index.js'

import { 
  AccountRepository, 
  NoteRepository,
  SessionRepository
} from '../repository/index.js'

declare global {
  namespace Express {
    interface Request {
      accounts: AccountRepository,
      notes: NoteRepository,
      sessions: SessionRepository
    }
  }
}

const accountRepository = new AccountRepository()
const notesRepository = new NoteRepository()
const sessionRepository = new SessionRepository()

export default async (): Promise<Express> => {
  const oidc = new Oidc()
  const isserMetadata = await oidc.discover()
  console.log(`Successfully dicevered issuer: ${isserMetadata.issuer}`)
  
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(morgan('tiny'))

  app.set('view engine', 'pug')
  app.set('views', path.resolve(import.meta.dirname, 'views'));
  
  app.use((req, res, next) => {
    req.accounts = new AccountRepository()
    req.notes = new NoteRepository()
    req.sessions = new SessionRepository()
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