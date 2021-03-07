/* eslint-disable no-unused-vars */
import sequelize from './sequelize'
import Comment from './comment'
import CommentLike from './commentLike'
import Note from './note'
import Post from './post'
import PostLike from './postLike'
import User from './user'

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

export { sequelize, Comment, CommentLike, Note, Post, PostLike, User }
