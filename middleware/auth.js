const passport = require('../config/passport')
const { InputErrorException, AuthErrorException } = require('../util/exceptions')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user || err) {
      throw new AuthErrorException('unauthorized user')
    }
    req.user = user
    return next()
  })(req, res, next)
}

const fieldExamine = (req, res, next) => {
  const email = req.body.email?.trim()
  const password = req.body.password?.trim()

  if (!email || !password) {
    throw new InputErrorException('the field [email] or [password] is required')
  }
  return next()
}

module.exports = {
  authenticated,
  fieldExamine
}
