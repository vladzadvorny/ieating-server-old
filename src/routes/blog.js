import express from 'express'
import { Op } from 'sequelize'

import { permissions } from '../utils/permissions'
import { Post, PostLike, Upload, User } from '../models'
import { errorResponse, ValidationError } from '../utils/validationError'
import { filterPublicAttributes } from '../utils/publicAttributes'
import { AWSRoute } from '../constants/config'

const router = express.Router()

export default {
  url: '/blog',
  router
}

// add post
router.put('/', permissions('user'), async (req, res) => {
  const { title, body, uploads, language, isAnonymous } = req.body

  try {
    // check fields
    if (!title || !body) {
      const fields = []

      if (!title) {
        fields.push('title')
      }
      if (!body) {
        fields.push('body')
      }

      throw new ValidationError('BLOG_ALL_MUST_BE_FILLED', 'blog_001', fields)
    }

    const post = await Post.create({
      title,
      body,
      status: 'moderated',
      language,
      isAnonymous: isAnonymous || false,
      userId: req.user.id
    })

    if (uploads.length) {
      await post.addUploads(uploads.map(upload => upload.id))
    }

    return res.json({ post: filterPublicAttributes(post, Post), uploads })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// get all posts
router.get('/', permissions('user'), async (req, res) => {
  const { page = 1, limit = 10, language = 'en' } = req.query

  try {
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { language, status: 'publish' },
          { status: 'moderated', userId: req.user.id }
        ]
      },
      order: [['createdAt', 'DESC']],
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
          attributes: ['id']
        },
        {
          model: User,
          attributes: ['id', 'name'],
          include: {
            model: Upload,
            as: 'avatar'
          }
        },
        {
          model: Upload,
          as: 'uploads',
          attributes: ['id', 'path', 'type']
        }
      ]
    })

    return res.json({
      posts: posts.map(post => {
        const user = JSON.parse(JSON.stringify(post.user))

        return {
          ...filterPublicAttributes(post, Post),
          isLiked: !!post.post_likes.length,
          user: {
            ...user,
            avatar: post.user?.avatar && {
              ...filterPublicAttributes(post.user.avatar, Upload),
              uri: `${AWSRoute}/${post.user.avatar.path}`
            }
          },
          uploads: post.uploads.map(upload => ({
            ...filterPublicAttributes(upload, Upload),
            uri: `${AWSRoute}/${upload.path}`
          }))
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// set/unset like
router.get('/like', permissions('user'), async (req, res) => {
  const { postId } = req.query

  try {
    const like = await PostLike.findOne({
      where: {
        postId: +postId,
        userId: req.user.id
      }
    })

    // если лайка нет - ставим
    if (!like) {
      const newLike = await PostLike.create({
        postId: +postId,
        userId: req.user.id
      })

      await Post.increment({ likes: '1' }, { where: { id: +postId } })

      return res.json({
        postId: newLike.postId,
        isSet: true
      })
    }

    // если лайк есть и он не удалён - удаляем
    if (like.isSet) {
      like.isSet = false

      await like.save()

      await Post.increment({ likes: '-1' }, { where: { id: +postId } })
    } else {
      // иначе ставим
      like.isSet = true

      await like.save()

      await Post.increment({ likes: '1' }, { where: { id: +postId } })
    }

    return res.json({
      postId: like.postId,
      isSet: like.isSet
    })
  } catch (error) {
    return res.json(errorResponse(error))
  }
})
