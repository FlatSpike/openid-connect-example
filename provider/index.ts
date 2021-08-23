import { app } from './app'

const port = 3000

app.listen(port, () => {
  console.log(`Oidc provider app listening at http://sso.auth.ru:${port}`)
})