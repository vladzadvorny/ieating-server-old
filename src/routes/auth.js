import express from 'express'
import EmailValidator from 'email-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { ValidationError, errorResponse } from '../utils/validationError'
import { permissions } from '../utils/permissions'
import { User } from '../models'
import { filterPublicAttributes } from '../utils/publicAttributes'
import { jwtSecret, jwtIssuer as issuer } from '../constants/config'

const router = express.Router()

export default {
  url: '/auth',
  router
}

// register
router.put('/local', permissions('user'), async (req, res) => {
  const { email: _email, password, passwordConfirm } = req.body

  const email = `${_email}`.toLowerCase().trim()

  try {
    // check fields
    if (!email || !password || !passwordConfirm) {
      const fields = []

      if (!email) {
        fields.push('email')
      }
      if (!password) {
        fields.push('password')
      }
      if (!passwordConfirm) {
        fields.push('passwordConfirm')
      }

      throw new ValidationError('AUTH_ALL_MUST_BE_FILLED', 'auth_001', fields)
    }

    // check email
    if (!EmailValidator.validate(email)) {
      throw new ValidationError('AUTH_EMAIL_INCORRECT', 'auth_002', ['email'])
    }

    // find email
    const user = await User.findOne({
      where: {
        'providers.local.email': email
      }
    })

    if (user) {
      throw new ValidationError('AUTH_EMAIL_IS_BUSY', 'auth_0021', ['email'])
    }

    if (`${password}`.length < 5) {
      throw new ValidationError(
        'AUTH_PASSWORD_INCORRECT',
        'auth_003',
        ['password', 'passwordConfirm'],
        { min: 5 }
      )
    }

    if (password !== passwordConfirm) {
      throw new ValidationError('AUTH_PASSWORDS_DO_NOT_MATCH', 'auth_004', [
        'password',
        'passwordConfirm'
      ])
    }

    const me = await User.findByPk(req.user.id)

    console.log('hello')
    if (!me) {
      throw new Error('User not exist')
    }

    me.providers = {
      local: {
        email,
        hash: bcrypt.hashSync(password, 8)
      }
    }

    await me.save()

    return res.json({
      me: {
        ...filterPublicAttributes(me, User),
        providers: {
          local: {
            email
          }
        }
      }
    })
  } catch (error) {
    // console.log(error)
    return res.json(errorResponse(error))
  }
})

// login
router.post('/local', permissions('user'), async (req, res) => {
  const { email: _email, password } = req.body
  const email = `${_email}`.toLowerCase().trim()

  try {
    // check fields
    if (!email || !password) {
      const fields = []

      if (!email) {
        fields.push('email')
      }
      if (!password) {
        fields.push('password')
      }

      throw new ValidationError('AUTH_ALL_MUST_BE_FILLED', 'auth_011', fields)
    }

    // find me
    const me = await User.findOne({
      where: {
        'providers.local.email': email
      }
    })

    if (!me) {
      throw new ValidationError('AUTH_INVALID_EMAIL_OR_PASSWORD', 'auth_009', [
        'email',
        'password'
      ])
    }

    if (!bcrypt.compareSync(password, JSON.parse(me.providers).local.hash)) {
      throw new ValidationError('AUTH_INVALID_EMAIL_OR_PASSWORD', 'auth_009', [
        'email',
        'password'
      ])
    }

    // inactived me
    const oldMe = await User.findByPk(req.user.id)

    if (!oldMe) {
      throw new Error('User not exist')
    }

    if (me.id === oldMe.id) {
      throw new Error('Fuck you!')
    }

    oldMe.status = 'inactive'
    oldMe.pushToken = ''

    await oldMe.save()

    return res.json({
      me: {
        ...filterPublicAttributes(me, User),
        providers: {
          local: {
            email
          }
        }
      },
      token: jwt.sign(
        {
          user: { id: me.id }
        },
        jwtSecret,
        {
          expiresIn: `${365 * 5 * 10}d`,
          issuer
        }
      )
    })
  } catch (error) {
    // console.log(error)
    return res.json(errorResponse(error))
  }
})
