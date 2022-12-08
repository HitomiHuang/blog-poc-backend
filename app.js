const express = require('express')

const app = express()
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
