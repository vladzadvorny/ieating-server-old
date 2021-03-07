import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'
import Post from './post'

class PostLike extends Model {}

PostLike.init(
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
    modelName: 'post_like',
    timestamps: true,
    updatedAt: false
  }
)

// eslint-disable-next-line no-unused-vars
PostLike.beforeCreate(async (model, options) => {
  try {
    await Post.increment({ likes: '1' }, { where: { id: model.postId } })
  } catch (error) {
    console.log(error)
  }
})

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
