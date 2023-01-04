const helper = require('../util/auth-helpers')
const { User, Followship } = require('../models')
const { UserNotFoundException } = require('../util/exceptions')
const awsHandler = require('../util/aws-helpers')
const signature = require('cookie-signature')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const userController = {
  signIn: (req, res, next) => {
    try {
      return res.status(200).cookie('connect.sid', `s: ${signature.sign(req.sessionID, process.env.COOKIESIGN)}`).json({
        status: 'success'
        //   data: {
        //     'connect.sid': `s: ${signature.sign(req.sessionID, process.env.COOKIESIGN)}`
        //   }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
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
      const avatar = req.file ? await awsHandler.addAvatar(user.id, req.file) : null

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
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers', attributes: ['id', 'name', 'avatar', 'bio'] }
        ]
      })
      if (!user) throw new UserNotFoundException('user did not exist')

      const Followers = await user.toJSON().Followers.map(followers => ({
        ...followers,
        followingAt: followers.Followship.createdAt,
        isFollowing: helper.getUser(req).Followings.some(f => f.id === followers.id),
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
  getFollowings: async(req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followings', attributes: ['id', 'name', 'avatar', 'bio'] }
        ]
      })
      if (!user) throw new UserNotFoundException('user did not exist')
      const Followings = await user.toJSON().Followings.map(followings => ({
        ...followings,
        
      }))
      
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
