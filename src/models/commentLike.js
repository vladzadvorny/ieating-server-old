import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'
import Comment from './comment'

class CommentLike extends Model {}

CommentLike.init(
  {
    isSet: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_set'
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

// eslint-disable-next-line no-unused-vars
CommentLike.beforeCreate(async (model, options) => {
  try {
    await Comment.increment({ likes: '1' }, { where: { id: model.commentId } })
  } catch (error) {
    console.log(error)
  }
})

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
