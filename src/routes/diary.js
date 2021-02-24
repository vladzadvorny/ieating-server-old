import express from 'express'
import _ from 'lodash'
import { Op } from 'sequelize'
import moment from 'moment'

import { permissions } from '../utils/permissions'
import { Note } from '../models'
import { ValidationError, errorResponse } from '../utils/validationError'
import { filterPublicAttributes } from '../utils/publicAttributes'

const router = express.Router()

export default {
  url: '/diary',
  router
}

// add note
router.put('/', permissions('user'), async (req, res) => {
  const data = _.pick(req.body, [
    'meal',
    'time',
    'place',
    'satietyBefore',
    'moodBefore',
    'description',
    'satietyAfter',
    'moodAfter',
    'cause'
  ])

  try {
    const note = await Note.create({ ...data, userId: req.user.id })

    res.json({ note: filterPublicAttributes(note, Note) })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// get day notes
router.get('/day', permissions('user'), async (req, res) => {
  const startDate = req.query?.start

  try {
    if (!startDate) {
      throw new Error('Error')
    }

    const notes = await Note.findAll({
      where: {
        userId: req.user.id,
        time: {
          [Op.gte]: moment(startDate).toDate(),
          [Op.lt]: moment(startDate).add(1, 'day').toDate()
        }
      },
      order: [['time', 'ASC']]
    })

    res.json({ notes: notes.map(note => filterPublicAttributes(note, Note)) })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})
