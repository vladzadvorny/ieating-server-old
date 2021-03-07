import express from 'express'

import { permissions } from '../utils/permissions'
import { Post, PostLike } from '../models'
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
  const { page = 1, limit = 1, language = 'en' } = req.query

  try {
    const posts = await Post.findAll({
      where: {
        language
      },
      order: [['createdAt', 'ASC']],
      limit: +limit,
      offset: 0 + (page - 1) * limit,
      // raw: true,
      include: [
        {
          model: PostLike,
          required: false,
          where: {
            userId: req.user.id,
            isSet: true
          },
          attributes: ['id', 'isSet']
        }
      ]
    })

    return res.json({
      posts: posts.map(post => ({
        ...filterPublicAttributes(post, Post),
        isLiked: !!post.post_likes.length
      }))
    })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// set like
router.put('/like', permissions('user'), async (req, res) => {
  const { postId } = req.query

  try {
    const like = await PostLike.findOne({
      where: {
        postId: +postId,
        userId: req.user.id
      }
    })

    if (like) {
      if (!like.isSet) {
        await Post.increment({ likes: '1' }, { where: { id: +postId } })

        like.isSet = true
        await like.save()
      }

      return res.json({
        postId: like.postId,
        new: false
      })
    }

    const newLike = await PostLike.create({
      postId: +postId,
      userId: req.user.id
    })

    await Post.increment({ likes: '1' }, { where: { id: +postId } })

    return res.json({
      postId: newLike.postId,
      new: true
    })
  } catch (error) {
    return res.json(errorResponse(error))
  }
})

// unset like
router.delete('/like', permissions('user'), async (req, res) => {
  const { postId } = req.query

  try {
    // const like = await PostLike.update(
    //   { isSet: false },
    //   {
    //     where: { postId: +postId, userId: req.user.id },
    //     returning: true,
    //     plain: true
    //   }
    // )

    const like = await PostLike.findOne({
      where: {
        postId: +postId,
        userId: req.user.id,
        isSet: true
      }
    })

    if (!like) {
      return res.json({
        postId,
        new: false
      })
    }

    like.isSet = false

    await like.save()

    await Post.increment({ likes: '-1' }, { where: { id: +postId } })

    return res.json({
      postId: like.postId,
      new: true
    })
  } catch (error) {
    return res.json(errorResponse(error))
  }
})