import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  const session = req.session.local
  const accoutnId = session.accountId as string

  const account = await req.accounts.findById(accoutnId)
  if (!account) return res.end(`No account by id=${accoutnId}`)

  res.render('info', { account: account })
})

export default router