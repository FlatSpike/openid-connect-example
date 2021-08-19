import { Router } from 'express'

const router = Router()

router.get('/', async (req, res, next) => {
  const session = req.session.local
  const accoutnId = session.accountId as string

  const account = await req.accounts.findById(accoutnId)
  if (!account) return res.end(`No account by id=${accoutnId}`)

  const notes = await req.notes.getByAccountId(accoutnId)

  res.render('notes', { notes: notes, account: account })
})

export default router