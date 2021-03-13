import express from 'express'
import AWS from 'aws-sdk'
import sharp from 'sharp'

import { permissions } from '../utils/permissions'
import { errorResponse, ValidationError } from '../utils/validationError'
import { Upload } from '../models'
import { AWSBucket as Bucket, AWSRoute } from '../constants/config'
import { filterPublicAttributes } from '../utils/publicAttributes'

const router = express.Router()

export default {
  url: '/upload',
  router
}

router.post('/', permissions('user'), async (req, res) => {
  const { thumb } = req.query
  try {
    const s3 = new AWS.S3()
    const { file } = req.files

    if (file.mimetype !== 'image/jpeg') {
      throw new ValidationError('UPLOAD_MIMETYPE_INCORRECT', 'upload_001', [])
    }

    const buffer = Buffer.from(file.data, 'binary')

    const Body = await sharp(buffer)
      .jpeg({
        quality: 40
      })
      .toBuffer()

    const Key = `${Math.random()
      .toString(36)
      .slice(-1)}/${Math.random()
      .toString(36)
      .slice(-1)}/${(+new Date()).toString(36)}.jpg`

    // await s3.createBucket({ Bucket }).promise()

    const data = await s3
      .upload({
        Bucket,
        Key,
        Body,
        ACL: 'public-read'
      })
      .promise()

    if (thumb) {
      const BodyThumb = await sharp(buffer)
        .jpeg({
          quality: 40
        })
        .resize(150, 150)
        .toBuffer()

      // eslint-disable-next-line no-unused-vars
      const dataThumb = await s3
        .upload({
          Bucket,
          Key: Key.replace('.jpg', '_thumb.jpg'),
          Body: BodyThumb,
          ACL: 'public-read'
        })
        .promise()
    }

    const upload = await Upload.create({
      path: data.Key,
      type: 'image',
      userId: req.user.id
    })

    return res.json({
      upload: {
        ...filterPublicAttributes(upload, Upload),
        uri: `${AWSRoute}/${upload.path}`
      }
    })
  } catch (error) {
    return res.json(errorResponse(error))
  }
})
