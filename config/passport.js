const passport = require('passport')
const LocalStrategy = require('passport-local')
const { UserNotFoundException } = require('../util/exceptions')
const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'userName',
    passwordField: 'password'
  },
  async (userName, password, done) => {
    try {
      const user = await User.findOne({ where: { userName } })
      if (!user) throw new UserNotFoundException('user not found')
      if (user.password !== password) throw new Error('userName or password wrong')
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
