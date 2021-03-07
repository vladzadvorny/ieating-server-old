import faker from 'faker'

import { Post, PostLike, Comment, CommentLike } from './models'

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

export default async () => {
  // remove posts
  await Post.destroy({
    where: {},
    truncate: { cascade: true }
  })

  // create posts
  Array.from({ length: 100 }).forEach(async (_, i) => {
    const post = await Post.create({
      title: faker.lorem.words(4),
      body: faker.lorem.words(30),
      isAnonymous: Math.random() < 0.5,
      language: 'en',
      userId: getRandomArbitrary(1, 10)
    })

    // create Post likes
    Array.from({ length: getRandomArbitrary(3, 7) }).forEach(async (_, i) => {
      // eslint-disable-next-line no-unused-vars
      const postLike = await PostLike.create({
        postId: post.id,
        userId: i + 1
      })
    })

    // create comments
    Array.from({ length: getRandomArbitrary(3, 7) }).forEach(async (_, i) => {
      const comment = await Comment.create({
        body: faker.lorem.words(20),
        postId: post.id,
        userId: i + 1
      })

      // create comment likes
      Array.from({ length: getRandomArbitrary(3, 7) }).forEach(async (_, i) => {
        // eslint-disable-next-line no-unused-vars
        const commentLike = await CommentLike.create({
          commentId: comment.id,
          userId: i + 1
        })
      })
    })
  })
}
