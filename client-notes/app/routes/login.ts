import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  const sid = req.session.sid
  if (!sid) return res.render('login')
  res.redirect('/')
})

export default router