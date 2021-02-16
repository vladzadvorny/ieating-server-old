import express from 'express'
import cors from 'cors'

const port = 3001
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cors())

app.get('/', (req, res) => res.json({ hello: 'world' }))

app.listen({ port }, () => {
  console.log(`✓ Started API server at http://localhost:${port}`)
})
