import { app } from './app'

const port = 3001

app()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Example oidc client (notes) listening at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.log(`Cant start server`, err)
  })
