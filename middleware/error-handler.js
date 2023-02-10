const { NotFoundException, AuthErrorException, InputErrorException, UploadFailedException, EmailOrPasswordWrongException } = require('../util/exceptions')
const httpStatusCodes = require('../util/httpStatusCodes')
module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof NotFoundException) {
      res.status(httpStatusCodes.NOT_FOUND).json({
        status: `${err.name}`,
        message: `${err.message}`
      })
    } else if (err instanceof AuthErrorException) {
      res.status(httpStatusCodes.AUTH_ERROR).json({
        status: `${err.name}`,
        message: `${err.message}`
      })
    } else if (err instanceof UploadFailedException) {
      res.status(httpStatusCodes.UPLOAD_FAILED).json({
        status: `${err.name}`,
        message: `${err.message}`
      })
    } else if (err instanceof InputErrorException) {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        status: `${err.name}`,
        message: `${err.message}`
      })
    } else if (err instanceof EmailOrPasswordWrongException) {
      res.status(httpStatusCodes.BAD_REQUEST).json({
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
