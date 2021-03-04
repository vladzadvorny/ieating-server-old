import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'
import Comment from './comment'

class CommentLike extends Model {}

CommentLike.init(
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
    modelName: 'comment_like',
    timestamps: true,
    updatedAt: false
  }
)

// 1:M
CommentLike.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false
  }
})

// 1:M
CommentLike.belongsTo(Comment, {
  foreignKey: {
    name: 'commentId',
    field: 'comment_id',
    allowNull: false
  }
})

export default CommentLike
