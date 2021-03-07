import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'
import Post from './post'

class Comment extends Model {}

Comment.init(
  {
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      public: true
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      public: true
    },

    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  },
  {
    sequelize,
    modelName: 'comment',
    timestamps: true
  }
)

// 1:M
Comment.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false
  }
})

// 1:M
Comment.belongsTo(Post, {
  foreignKey: {
    name: 'postId',
    field: 'post_id',
    allowNull: false
  }
})

export default Comment
