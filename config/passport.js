const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const { NotFoundException, EmailOrPasswordWrongException } = require('../util/exceptions')
const { User } = require('../models')
const JWTSECRET = process.env.JWT_SECRET || 'blog-poc-backend'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) throw new NotFoundException('the email have not been registered')
      if (user.password !== password) throw new EmailOrPasswordWrongException('email or password wrong')
      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTSECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

// passport.serializeUser((user, done) => {
//   done(null, user.id)
// })

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findByPk(id, {
//     include: [
//       { model: User, as: 'Followings' },
//       { model: User, as: 'Followers' }]
//   })

//   return done(null, user.toJSON())
// })

module.exports = passport
