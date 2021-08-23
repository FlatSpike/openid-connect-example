import { Router, Request, Response, NextFunction } from 'express'

import { Account } from '../../repository/accounts'

import login from './login'
import notes from './info'
import oidc from './oidc'

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
router.use('/info', isAuth, notes)
router.use('/oidc', oidc)

router.use('/*', (req, res) => {
  res.redirect('/info')
})

export default router