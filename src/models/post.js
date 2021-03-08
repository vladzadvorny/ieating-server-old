import { Model, DataTypes } from 'sequelize'
import PostLike from './postLike'

import sequelize from './sequelize'
import User from './user'

class Post extends Model {}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      public: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      public: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['publish', 'draft', 'deleted', 'moderated'],
      allowNull: false,
      defaultValue: 'moderated',
      public: true
    },
    language: {
      type: DataTypes.ENUM,
      values: ['ru', 'en'],
      allowNull: false,
      defaultValue: 'en',
      public: true
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      public: true
    },
    comments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      public: true
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_anonymous'
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

Post.hasMany(PostLike, {
  foreignKey: {
    name: 'postId',
    field: 'post_id',
    allowNull: false
  }
})

export default Post
