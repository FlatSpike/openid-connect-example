import { Router, Request, Response, NextFunction } from 'express'

import { Account } from '../../repository/accounts.js'

import login from './login.js'
import notes from './notes.js'
import oidc from './oidc.js'

const router = Router()

declare global {
  namespace Express {
    interface Request {
      auth?: { account: Account }
    }
  }
}

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const sid = req.session.sid
  if (!sid) return res.redirect('/login')

  const session = await req.sessions.findBySid(sid)
  if (!session) {
    req.session.sid = undefined
    return res.redirect('/login')
  }

  const account = await req.accounts.findById(session.accountId)
  if (!account) {
    req.session.sid = undefined
    return res.redirect('/login')
  }

  req.auth = { account: account }

  return next()
}

router.use('/login', login)
router.use('/notes', isAuth, notes)
router.use('/oidc', oidc)

router.use('/*', (req, res) => {
  res.redirect('/notes')
})

export default router