const { ensureAuthenticated } = require('../util/auth-helpers')
const passport = require('../config/passport')
const { EmailOrPasswordWrongException, InputErrorException, AuthErrorException } = require('../util/exceptions')

const localAuthenticate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const { email, password } = req.body
    if (!email || !password) {
      throw new InputErrorException('the field [email] or [password] is required')
    }

    if (!user || err) {
      throw new EmailOrPasswordWrongException('email or password is wrong')
    }

    req.login(user, function (err) {
      if (err) {
        next(err)
      }
    })
    return next()
  })(req, res, next)
}

const fieldExamine = (req, res, next) => {
  const { email, password } = req.body
  if (!email.trim() || !password.trim()) throw new InputErrorException('the fields [email] and [password] are required')
  req.body.email = email.trim()
  req.body.password = password.trim()
  return next()
}

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  throw new AuthErrorException('unauthorized user')
}

module.exports = {
  authenticated,
  localAuthenticate,
  fieldExamine
}
