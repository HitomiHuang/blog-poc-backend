const { UserNotFoundException } = require('../util/exceptions')
const httpStatusCodes = require('../util/httpStatusCodes')
module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof UserNotFoundException) {
      res.status(httpStatusCodes.NOT_FOUND).json({
        status: `${err.name}`,
        message: `${err.message}`
      })
    } else {
      res.status(httpStatusCodes.SERVER_ERROR).json({
        status: 'System Error',
        message: `${err.message}`
      })
    }
    next(err)
  }
}
