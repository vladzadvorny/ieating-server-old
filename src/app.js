import express from 'express'
import cors from 'cors'

import { port } from './constants/config'
import { sequelize } from './models'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cors())

app.get('/', (req, res) => res.json({ hello: 'world' }))

// start db and server
sequelize
  .sync({
    force: true
  })
  .then(({ config }) => {
    console.log(
      `✓ DB connected to ${config.host}:${config.port}, database: ${config.database}`
    )

    app.listen({ port }, () => {
      console.log(`✓ Started API server at http://localhost:${port}`)
    })
  })
  .catch(console.log)
