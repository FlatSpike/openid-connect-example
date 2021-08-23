import { app } from './app'

const port = 3002

app()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Oidc client "info" listening at http://sso.info.ru:${port}`)
    })
  })
  .catch((err) => {
    console.log(`Cant start server`, err)
  })
