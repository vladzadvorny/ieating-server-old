import { Model } from 'sequelize'

import sequelize from './sequelize'

class PostUpload extends Model {}

PostUpload.init(
  {},
  {
    sequelize,
    modelName: 'post_upload',
    timestamps: false
  }
)

export default PostUpload
