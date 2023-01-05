const helper = require('../util/auth-helpers')
const { User, Followship, Story, Response } = require('../models')
const { UserNotFoundException } = require('../util/exceptions')
const awsHandler = require('../util/aws-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const userController = {
  signIn: (req, res, next) => {
    try {
      return res.status(200)
        .json({
          status: 'success',
          data: {
            user: helper.getUser(req).userName
          }
        })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { userName: req.params.userName },
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      if (!user) throw new UserNotFoundException('user did not exist')

      return res.status(200).json({
        status: 'success',
        data: {
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          bio: user.bio,
          isFollowing: helper.getUser(req)?.Followings.some(f => f.id === user.id) || false
        }
      })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name, bio, password, email } = req.body
      const user = await User.findByPk(helper.getUser(req).id)
      if (!user) throw new UserNotFoundException('user did not exist')
      const avatar = req.file ? await awsHandler.addAvatar(user.userName, req.file) : null

      await user.update({
        name: name?.trim() || user.name,
        password: password?.trim() || user.password,
        bio: bio?.trim() || user.bio,
        email: email?.trim() || user.email,
        avatar: avatar || user.avatar
      })

      return res.status(200).json({
        status: 'success',
        data: {
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { userName: req.params.userName },
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers', attributes: ['id', 'name', 'avatar', 'bio'] }
        ]
      })

      if (!user) throw new UserNotFoundException('user did not exist')

      const Followers = await user.toJSON().Followers.map(followers => ({
        ...followers,
        followingAt: followers.Followship.createdAt,
        isFollowing: helper.getUser(req)?.Followings.some(f => f.id === followers.id) || false,
        Followship
      }))
        .sort((a, b) => b.followingAt - a.followingAt)

      return res.status(200).json({
        status: 'success',
        data: {
          Followers
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { userName: req.params.userName },
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followings', attributes: ['id', 'name', 'avatar', 'bio'] }
        ]
      })

      if (!user) throw new UserNotFoundException('user did not exist')

      const Followings = await user.toJSON().Followings.map(followings => ({
        ...followings,
        followingAt: followings.Followship.createdAt,
        isFollowing: helper.getUser(req)?.Followings.some(f => f.id === followings.id) || false,
        Followship
      }))
        .sort((a, b) => b.followingAt - a.followingAt)

      return res.status(200).json({
        status: 'success',
        data: {
          Followings
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getDraftStory: async (req, res, next) => {
    try {
      const user = await User.findByPk(helper.getUser(req).id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Story,
            attributes: { exclude: ['userId', 'createdAt'] },
            where: { status: 'draft' }
          }
        ]
      })

      if (!user) throw new UserNotFoundException('user did not exist')

      const draftStories = user.toJSON().Stories.map(story => ({
        ...story,
        content: story.content.substring(0, 300)
      }))
        .sort((a, b) => b.updatedAt - a.updatedAt)

      return res.status(200).json({
        status: 'success',
        data: {
          draftStories
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getPublishedStory: async (req, res, next) => {
    try {
      const user = await User.findByPk(helper.getUser(req).id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Story,
            attributes: { exclude: ['userId', 'createdAt'] },
            where: { status: 'published' }
          }
        ]
      })

      if (!user) throw new UserNotFoundException('user did not exist')

      const publishedStories = user.toJSON().Stories.map(story => ({
        ...story,
        content: story.content.substring(0, 300)
      }))
        .sort((a, b) => b.updatedAt - a.updatedAt)

      return res.status(200).json({
        status: 'success',
        data: {
          publishedStories
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getResponses: async (req, res, next) => {
    try {
      const user = await User.findByPk(helper.getUser(req).id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Response,
            attributes: { exclude: ['id', 'userId', 'createdAt'] }
          }
        ]
      })

      if (!user) throw new UserNotFoundException('user did not exist')

      const responses = user.toJSON().Responses.map(response => ({
        ...response,
        content: response.content.substring(0, 100)
      }))
        .sort((a, b) => b.updatedAt - a.updatedAt)

      return res.status(200).json({
        status: 'success',
        data: {
          responses
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
