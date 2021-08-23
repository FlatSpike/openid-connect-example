import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  const account = req.auth?.account
  res.render('info', { account: account })
})

export default router