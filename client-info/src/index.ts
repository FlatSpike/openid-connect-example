import { app } from './app/index.js'

const port = 3002

app()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Oidc client "info" listening at ${port}`)
    })
  })
  .catch((err) => {
    console.log(`Cant start server`, err)
  })
