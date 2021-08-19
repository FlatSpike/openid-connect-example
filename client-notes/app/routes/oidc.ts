import { Router } from 'express'
import { generators } from 'openid-client'

const router = Router()

declare module 'express-session' {
  interface SessionData {
    oidc: any
    local: any
  }
}

router.get('/auth', async (req, res) => {
  const client = req.oidc.client

  const code_verifier = generators.codeVerifier()
  const code_challenge = generators.codeChallenge(code_verifier)

  const authorizationUrl = client.authorizationUrl({
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
  })

  req.session.oidc = { code_verifier }
  res.redirect(authorizationUrl)
})

router.get('/cb', async (req, res) => {
  const client = req.oidc.client

  if (!req.session.oidc) {
    return res.end('No oidc session')
  }

  const code_verifier = req.session.oidc.code_verifier

  const params = client.callbackParams(req)
  const tokenSet = await client.callback(
    'http://sso.notes.ru:3001/oidc/cb', 
    params, 
    { code_verifier }
  )

  const claims = tokenSet.claims()

  const accountId = claims.sub
  const account = req.accounts.findById(accountId)

  if (!account) return res.end(`No account by id=${accountId}`)

  req.session.oidc = undefined
  req.session.local = { accountId: claims.sub, idToken: tokenSet.id_token }

  res.redirect('/notes')
})

router.post('/logout', async (req, res) => {
  const client = req.oidc.client

  const idTocket = req.session.local.idToken

  const endSessionUrl = client.endSessionUrl({ 
    id_token_hint: idTocket
  })

  res.redirect(endSessionUrl)
})

router.get('/logout/cb', async (req, res) => {
  req.session.local = undefined
  res.redirect('/')
})

router.post('/logout/backchannel/cb', async (req, res) => {
  // TODO: add backchannel logout handler
  res.send('ok')
})

export default router