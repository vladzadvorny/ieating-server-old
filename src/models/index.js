/* eslint-disable no-unused-vars */
import sequelize from './sequelize'
import Comment from './comment'
import CommentLike from './commentLike'
import Note from './note'
import Post from './post'
import PostLike from './postLike'
import PostUpload from './postUpload'
import Upload from './upload'
import User from './user'

// Recipe Upload
// N:M
Upload.belongsToMany(Post, {
  through: PostUpload,
  foreignKey: {
    name: 'uploadId',
    field: 'upload_id'
  }
})

// N:M
Post.belongsToMany(Upload, {
  through: PostUpload,
  foreignKey: {
    name: 'postId',
    field: 'post_id'
  },
  as: 'uploads'
})

// PostLike.beforeCreate(async (model, options) => {
//   try {
//     await Post.increment({ likes: '1' }, { where: { id: model.postId } })
//   } catch (error) {
//     console.log(error)
//   }
// })

// PostLike.beforeUpdate(async (model, options) => {
//   try {
//     if (!model.isSet) {
//       await Post.increment({ likes: '-1' }, { where: { id: model.postId } })
//     } else {
//       await Post.increment({ likes: '1' }, { where: { id: model.postId } })
//     }
//   } catch (error) {
//     console.log(error)
//   }
// })

export { sequelize, Comment, CommentLike, Note, Post, PostLike, Upload, User }
