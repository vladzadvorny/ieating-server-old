import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'

class Post extends Model {}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['publish', 'draft', 'deleted', 'moderated'],
      allowNull: false,
      defaultValue: 'moderated'
    },
    language: {
      type: DataTypes.ENUM,
      values: ['ru', 'en'],
      allowNull: false,
      defaultValue: 'en'
    },

    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  },
  {
    sequelize,
    modelName: 'post',
    timestamps: true
  }
)

// 1:M
Post.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false
  }
})

export default Post
