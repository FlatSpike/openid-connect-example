import { app } from './app'

const port = 3001

app()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Oidc client "notes" listening at http://sso.notes.ru:${port}`)
    })
  })
  .catch((err) => {
    console.log(`Cant start server`, err)
  })
