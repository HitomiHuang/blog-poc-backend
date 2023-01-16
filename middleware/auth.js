const { ensureAuthenticated } = require('../util/auth-helpers')
const passport = require('../config/passport')

const localAuthenticate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const { email, password } = req.body
    if (!email || !password) {
      throw new Error('the field [email] or [password] is required')
    }

    if (!user || err) {
      return res.status(401).json({
        status: 'error',
        message: 'email or password is wrong'
      })
    }
    req.login(user.toJSON(), err => {
      if (err) {
        next(err)
      }
    })

    return next()
  })(req, res, next)
}

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  return res.status(401).json({
    status: 'error',
    message: 'unauthorized user'
  })
}

module.exports = {
  authenticated,
  localAuthenticate
}
