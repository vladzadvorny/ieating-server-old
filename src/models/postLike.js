import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'
import Post from './post'

class PostLike extends Model {}

PostLike.init(
  {
    status: {
      type: DataTypes.ENUM,
      values: ['on', 'off'],
      allowNull: false,
      defaultValue: 'on'
    },

    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  },
  {
    sequelize,
    modelName: 'post_like',
    timestamps: true,
    updatedAt: false
  }
)

// 1:M
PostLike.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false
  }
})

// 1:M
PostLike.belongsTo(Post, {
  foreignKey: {
    name: 'postId',
    field: 'post_id',
    allowNull: false
  }
})

export default PostLike
