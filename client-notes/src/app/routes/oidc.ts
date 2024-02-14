import { Router } from 'express'
import { generators } from 'openid-client'
import { default as jwt, JwtPayload } from 'jsonwebtoken'

import { Session } from '../../repository/index.js'

const router = Router()

declare module 'express-session' {
  interface SessionData {
    code_verifier?: string
    sid?: string
  }
}

router.get('/auth', async (req, res) => {
  const client = await req.oidc.discover()

  const code_verifier = generators.codeVerifier()
  const code_challenge = generators.codeChallenge(code_verifier)

  const authorizationUrl = client.authorizationUrl({
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
  })

  req.session.code_verifier = code_verifier

  res.redirect(authorizationUrl)
})

router.get('/cb', async (req, res) => {
  const client = await req.oidc.discover()

  const code_verifier = req.session.code_verifier
  if (!code_verifier) return res.end('No oidc session')

  const params = client.callbackParams(req)
  const tokenSet = await client.callback(
    'http://sso.notes.ru/oidc/cb', 
    params, 
    { code_verifier }
  )

  const claims = tokenSet.claims()

  const accountId = claims.sub
  const account = await req.accounts.findById(accountId)

  if (!account) return res.end(`No account by id=${accountId}`)

  const sid = claims.sid as string
  const idTocken = tokenSet.id_token as string

  const session = new Session(sid, accountId, idTocken)
  await req.sessions.save(session)

  req.session.code_verifier = undefined
  req.session.sid = sid

  res.redirect('/')
})

router.post('/logout', async (req, res) => {
  const client = await req.oidc.discover()

  const sid = req.session.sid
  if (!sid) return res.redirect('/')

  const session = await req.sessions.findBySid(sid)

  if (!session) return res.end("No session found")

  const endSessionUrl = client.endSessionUrl({ 
    id_token_hint: session.idToken
  })

  res.redirect(endSessionUrl)
})

router.get('/logout/cb', async (req, res) => {
  const sid = req.session.sid
  if (!sid) {
    req.session.sid = undefined
    return res.redirect('/')
  }

  const session = await req.sessions.findBySid(sid)
  if (!session) {
    req.session.sid = undefined
    return res.redirect('/')
  }

  await req.sessions.delete(session)

  req.session.sid = undefined
  res.redirect('/')
})

router.post('/logout/backchannel/cb', async (req, res) => {
  const logoutToken = req.body.logout_token
  const claims = jwt.decode(logoutToken) as JwtPayload

  // TODO: add token validation as described here 
  // https://openid.net/specs/openid-connect-backchannel-1_0-06.html#Validation

  const sid = claims.sid as string
  if (!sid) return res.status(400).end("Session id is required")

  const session = await req.sessions.findBySid(sid)
  if (!session) return res.status(400).end("No session")

  await req.sessions.delete(session)

  res.end("Ok")
})

export default router