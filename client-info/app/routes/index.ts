import { Router, Request, Response, NextFunction } from 'express'

import login from './login'
import notes from './info'
import oidc from './oidc'

const router = Router()

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.local) {
    return next()
  } else {
    return res.redirect('/login')
  }
}

router.use('/login', login)
router.use('/notes', isAuth, notes)
router.use('/oidc', oidc)

router.use('/*', (req, res) => {
  res.redirect('/login')
})

export default router