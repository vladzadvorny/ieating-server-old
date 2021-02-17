/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken'

import { jwtSecret, jwtIssuer as issuer } from '../constants/config'

export const permissions = role => {
  return async (req, res, next) => {
    req.user = null

    try {
      // check token
      const token = req.headers.authorization

      if (!token) {
        throw new Error()
      }

      const arr = token.split(' ')
      if (arr[0] !== 'Bearer' || !arr[1]) {
        throw new Error()
      }

      const { user } = jwt.verify(arr[1], jwtSecret, { issuer })

      if (!user) {
        throw new Error()
      }

      // check user in db
      // const _user = await userRepository.findOne(user.id);

      // if (!_user) {
      //   throw new Error();
      // }

      // // check role
      // if (role !== user.role) {
      //   throw new Error();
      // }

      // const adminIds = [1, 2]

      // if (role === 'admin' && adminIds.indexOf(user.id) === -1) {
      //   throw new Error()
      // }

      req.user = user
      return next()
    } catch (error) {
      return res.sendStatus(401)
    }
  }
}
