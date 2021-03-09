import express from 'express'
import _ from 'lodash'
import { Op } from 'sequelize'
import moment from 'moment'

import { permissions } from '../utils/permissions'
import { Note, Upload } from '../models'
import { errorResponse } from '../utils/validationError'
import { filterPublicAttributes } from '../utils/publicAttributes'
import { AWSRoute } from '../constants/config'

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
    'cause',
    'uploadId'
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
      order: [['time', 'ASC']],
      include: [{ model: Upload, required: false }]
    })

    res.json({
      notes: notes.map(note => ({
        ...filterPublicAttributes(note, Note),
        upload: note.upload && {
          ...filterPublicAttributes(note.upload, Upload),
          uri: `${AWSRoute}/${note.upload.path}`
        }
      }))
    })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})

// get month analytics
router.get('/analytics', permissions('user'), async (req, res) => {
  const today = moment().endOf('day')

  const counts = {
    // time: {},
    meal: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    },
    satietyBefore: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    moodBefore: {
      excellent: 0,
      calm: 0,
      neutral: 0,
      nervous: 0,
      sad: 0,
      guilty: 0,
      terrible: 0
    },
    satietyAfter: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    moodAfter: {
      excellent: 0,
      calm: 0,
      neutral: 0,
      nervous: 0,
      sad: 0,
      guilty: 0,
      terrible: 0
    }
  }

  try {
    const notes = await Note.findAll({
      attributes: [
        'meal',
        // 'time',
        'satietyBefore',
        'moodBefore',
        'satietyAfter',
        'moodAfter'
      ],
      where: {
        userId: req.user.id,
        time: {
          [Op.gte]: today.clone().subtract(30, 'days').toDate(),
          [Op.lt]: today.clone().toDate()
        }
      },
      order: [['time', 'ASC']],
      raw: true
    })

    notes
      // .map(note =>
      //   _.pick(note, [
      //     'meal',
      //     'satietyBefore',
      //     'moodBefore',
      //     'satietyAfter',
      //     'moodAfter'
      //   ])
      // )
      .forEach(note => {
        const keys = Object.keys(note)

        keys.forEach(key => {
          try {
            // eslint-disable-next-line operator-assignment
            counts[key][note[key]] = counts[key][note[key]] + 1
          } catch (error) {
            console.log(error)
          }
        })
      })

    // notes.forEach(note => {
    //   const time = moment(note.time).startOf('day').toISOString()

    //   if (counts.time[time] === undefined) {
    //     counts.time[time] = 1
    //   } else {
    //     // eslint-disable-next-line operator-assignment
    //     counts.time[time] = counts.time[time] + 1
    //   }
    // })

    res.json({
      counts
    })
  } catch (error) {
    console.log(error)
    return res.json(errorResponse(error))
  }
})
