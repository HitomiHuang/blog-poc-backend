const passport = require('passport')
const LocalStrategy = require('passport-local')
const { NotFoundException, EmailOrPasswordWrongException } = require('../util/exceptions')
const { User } = require('../models')

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

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id, {
    include: [
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }]
  })

  return done(null, user.toJSON())
})

module.exports = passport
