import express from 'express'

import { permissions } from '../utils/permissions'
import { Post } from '../models'
import { errorResponse, ValidationError } from '../utils/validationError'
import { filterPublicAttributes } from '../utils/publicAttributes'

const router = express.Router()

export default {
  url: '/blog',
  router
}

// add post
router.put('/', permissions('user'), async (req, res) => {
  const { title, body, language } = req.body

  try {
    // check fields
    if (!title || !body) {
      const fields = []

      if (!title) {
        fields.push('email')
      }
      if (!body) {
        fields.push('password')
      }

      throw new ValidationError('BLOG_ALL_MUST_BE_FILLED', 'blog_001', fields)
    }

    const post = await Post.create({
      title,
      body,
      status: 'moderated',
      language,
      userId: req.user.id
    })

    return res.json({ post: filterPublicAttributes(post, Post) })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// get all posts
router.get('/', permissions('user'), async (req, res) => {
  const { page = 1, limit = 20, language = 'en' } = req.query

  try {
    const posts = await Post.findAll({
      where: {
        language
      },
      order: [['createdAt', 'ASC']],
      limit: +limit,
      offset: 0 + (page - 1) * limit
    })

    return res.json({
      posts: posts.map(post => filterPublicAttributes(post, Post))
    })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})
