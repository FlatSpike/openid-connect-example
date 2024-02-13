import { Router } from 'express'
import { Account } from '../../repository/accounts.js'

const router = Router()

router.get('/', async (req, res, next) => {
  const account = req.auth?.account as Account
  const notes = await req.notes.getByAccountId(account?.id)
  res.render('notes', { notes: notes, account: account })
})

export default router