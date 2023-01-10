const helper = require('../util/auth-helpers')
const { User, Followship } = require('../models')
const { UserNotFoundException } = require('../util/exceptions')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const { followingId } = req.body
      const followingUser = await User.findByPk(followingId)
      if (!followingUser) throw new UserNotFoundException('followingUser did not exist')
      const followerId = helper.getUser(req).id

      await Followship.create({ followerId, followingId })
      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const { followingId } = req.body
      const followship = await Followship.findOne({
        where: {
          followerId: helper.getUser(req).id,
          followingId
        }
      })
      if (!followship) throw new Error('You have not followed this user')

      await followship.destroy()

      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
