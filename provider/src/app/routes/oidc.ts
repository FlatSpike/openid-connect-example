import { Router } from 'express'
import { AccountRepository } from '../../repository/index.js';

// this is replica of grant type in openid library
// unfortunately its not exported from library,
// and because i am not familiar with typescript,
// i don`t know how to use it in code in right way,
// so i create this type declaration for convenience
declare class Grant {
    constructor(properties?: {
       clientId?: string | undefined
       accountId?: string | undefined 
      }
    )

    accountId?: string | undefined
    clientId?: string | undefined
    openid?: {
        scope?: string | undefined
        claims?: string[] | undefined
    } | undefined
    resources?: {
        [resource: string]: string
    } | undefined
    rejected?: Pick<Grant, 'openid' | 'resources'> | undefined

    addOIDCScope(scope: string): undefined
    rejectOIDCScope(scope: string): undefined
    getOIDCScope(): string
    getOIDCScopeEncountered(): string
    getOIDCScopeFiltered(filter: Set<string>): string

    addOIDCClaims(claims: string[]): undefined
    rejectOIDCClaims(claims: string[]): undefined
    getOIDCClaims(): string[]
    getOIDCClaimsEncountered(): string[]
    getOIDCClaimsFiltered(filter: Set<string>): string[]

    addResourceScope(resource: string, scope: string): undefined
    rejectResourceScope(resource: string, scope: string): undefined
    getResourceScope(resource: string): string
    getResourceScopeEncountered(resource: string): string
    getResourceScopeFiltered(resource: string, filter: Set<string>): string

    save(ttl?: number): Promise<string>;
    destroy(): Promise<void>;
}

// there are no description of details properties for prompts details object,
// so this class should fix this issue 
class Details { 
  missingOIDCScope: Array<string> | undefined
  missingOIDCClaims: Array<string> | undefined
  missingResourceScopes: Map<string, string> | undefined
}

const router = Router()

router.get('/interaction/:uid', async (req, res, next) => {
  const oidc = req.oidc

  try {
    const details = await oidc.interactionDetails(req, res);
    const { uid, prompt, params } = details;

    const client_id = params['client_id'] as string
    const client = await oidc.Client.find(client_id)

    // by default interaction consists of two parts
    // 'login' - page where user input his credentials
    // 'consent' - page where user confirm to give requested 
    //    scopes and climes to client
    if (prompt.name === 'login') {
        return res.render('login', {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Sign-in',
          flash: undefined,
        })
    }

    if (prompt.name === 'consent') {
        return res.render('interaction', {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Authorize',
        })
    }
  } catch (err) {
    return next(err);
  }
});

router.post('/interaction/:uid/login', async (req, res, next) => {
  const oidc = req.oidc

  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req, res)

    const client_id = params['client_id'] as string
    const client = await oidc.Client.find(client_id)

    // here we try to login user by its login and password
    const login = req.body.login
    const password = req.body.password

    const account = await AccountRepository.findByLogin(login)
    if (!account || !account.testPassword(password)) {
      return res.render('login', {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: req.body.email,
        },
        title: 'Sign-in',
        flash: 'Invalid email or password.',
      })
    }

    const result = {
      login: { accountId: account.sub },
    }

    await oidc.interactionFinished(
      req, res, result, { mergeWithLastSubmission: false }
    )

  } catch (err) {
    return next(err);
  }
})

router.post('/interaction/:uid/confirm', async (req, res, next) => {
  const oidc = req.oidc

  try {
    const { 
      prompt, params, session, grantId
    } = await oidc.interactionDetails(req, res);

    // we are gonna use exists grand or create new one
    let grant: Grant
    if (grantId) {
      grant = await oidc.Grant.find(grantId) as Grant
    } else {
      const accountId = session?.accountId
      const clientId = params.client_id as string
      grant = new oidc.Grant({ accountId, clientId }) as Grant
    } 
    
    const details = prompt.details as unknown as Details

    // here we determine witch scopes, claims and resources we are gonna
    // grant to client
    if (details.missingOIDCScope) {
      grant.addOIDCScope(details.missingOIDCScope.join(' '))
      // use grant.rejectOIDCScope to reject a subset or the whole thing
    }

    if (details.missingOIDCClaims) {
      grant.addOIDCClaims(details.missingOIDCClaims)
      // use grant.rejectOIDCClaims to reject a subset or the whole thing
    }

    if (details.missingResourceScopes) {
      for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
        grant.addResourceScope(indicator, scopes.join(' '));
        // use grant.rejectResourceScope to reject a subset or the whole thing
      }
    }

    // save changed grant
    const newGrantId = await grant.save()

    const result = {
      consent: { 
        grantId: newGrantId
      }
    }

    await oidc.interactionFinished(
      req, res, result, { mergeWithLastSubmission: true }
    )

  } catch (err) {
    next(err)
  }
})

router.get('/interaction/:uid/abort', async (req, res, next) => {
  const oidc = req.oidc

  try {
    // here we cancel current interaction by sending error result
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    }

    await oidc.interactionFinished(
      req, res, result, { mergeWithLastSubmission: false }
    )

  } catch (err) {
    next(err)
  }

})

export default router