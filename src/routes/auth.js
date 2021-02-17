import express from 'express'

const router = express.Router()

export default {
  url: '/auth',
  router
}

// register
router.get('/local', async (req, res) => {
  res.json({ hello: 'world' })
})
