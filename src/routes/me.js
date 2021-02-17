import express from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import { User } from '../models'
import { permissions } from '../utils/permissions'
import { filterPublicAttributes } from '../utils/publicAttributes'
import { jwtSecret, jwtIssuer as issuer } from '../constants/config'
import { ValidationError, errorResponse } from '../utils/validationError'

const router = express.Router()

export default {
  url: '/me',
  router
}

// register me
router.put('/', async (req, res) => {
  const ip =
    req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip || ''
  const { pushToken } = req.body

  try {
    const user = await User.findOne({
      where: {
        ip
      },
      order: [['createdAt', 'desc']]
    })

    let expire
    if (!user) {
      expire = -1
    } else {
      const lastUser = new Date(user.createdAt)
      lastUser.setMinutes(lastUser.getMinutes() + 10)
      expire = lastUser.getTime() - Date.now()
    }

    console.log(expire)

    // if (expire > 0) {
    //   throw new ValidationError('ME_CREATE_EXPIRE', 'check_001', [], {
    //     expire
    //   });
    // }

    const newUser = await User.create({
      name: '',
      ip,
      pushToken: pushToken || ''
    })

    return res.json({
      me: filterPublicAttributes(newUser, User),
      token: jwt.sign(
        {
          user: { id: newUser.id }
        },
        jwtSecret,
        {
          expiresIn: `${365 * 5}d`,
          issuer
        }
      )
    })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// get me
router.get('/', permissions('user'), async (req, res) => {
  try {
    const me = await User.findByPk(req.user.id)

    if (!me) {
      throw new Error('User not exist')
    }

    return res.json({ me: filterPublicAttributes(me, User) })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
})

// update me
router.post('/', permissions('user'), async (req, res) => {
  const ip =
    req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip || ''
  const { pushToken } = _.pick(req.body, ['pushToken'])

  try {
    const me = await User.findByPk(req.user.id)
    console.log('hello')
    if (!me) {
      throw new Error('User not exist')
    }

    me.pushToken = pushToken
    me.ip = ip

    await me.save()

    return res.json({ me: filterPublicAttributes(me, User) })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
})
