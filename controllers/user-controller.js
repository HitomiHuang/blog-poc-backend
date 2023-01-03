const helper = require('../util/auth-helpers')
const { User, Followship } = require('../models')
const { UserNotFoundException } = require('../util/exceptions')

const userController = {
  signIn: (req, res, next) => {
    try {
      const cookie = req?.headers?.cookie.split('=')[1]
      return res.status(200).json({
        status: 'success',
        data: {
          'connect.sid': cookie
        }
      })
    } catch (err) {
      next(err)
    }
  }

}
module.exports = userController
