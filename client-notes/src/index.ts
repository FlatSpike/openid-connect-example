import { app } from './app/index.js'

const port = 3001

app()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Oidc client "notes" listening at ${port}`)
    })
  })
  .catch((err) => {
    console.log(`Cant start server`, err)
  })
