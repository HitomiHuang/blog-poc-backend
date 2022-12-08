const userController = {
  signIn: (req, res, next) => {
    try {
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  putUser: (req, res, next) => {
  }
}
module.exports = userController
