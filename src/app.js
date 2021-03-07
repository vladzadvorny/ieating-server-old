/* eslint-disable import/no-dynamic-require */
import express from 'express'
import cors from 'cors'
import errorhandler from 'strong-error-handler'
import { readdirSync } from 'fs'
import { join } from 'path'

import { port, isDevelopment } from './constants/config'
import { sequelize } from './models'
import mocks from './mocks'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cors())

app.get('/', (req, res) => res.json({ hello: 'world' }))

// routes
const routesPath = join(__dirname, 'routes')
readdirSync(routesPath)
  .map(file => require(join(routesPath, file)).default)
  .forEach(({ url, router }) => {
    app.use(`/v1${url}`, router)
  })

// error handler
app.use(
  errorhandler({
    debug: isDevelopment,
    log: true
  })
)

// start db and server
sequelize
  .sync({
    // force: true
  })
  .then(({ config }) => {
    console.log(
      `✓ DB connected to ${config.host}:${config.port}, database: ${config.database}`
    )

    // mocks()
    app.listen({ port }, () => {
      console.log(`✓ Started API server at http://localhost:${port}`)
    })
  })
  .catch(console.log)
