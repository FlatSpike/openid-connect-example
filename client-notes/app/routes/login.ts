import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  const session = req.session.local

  if (session) {
    res.redirect('/notes')
  } else {
    res.render('login')
  }
})

export default router