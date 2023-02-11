const express = require('express')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const corsOptions = {
  origin: [
    'http://localhost:8080'
  ],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

const app = express()
app.use(cors(corsOptions))
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')

const port = process.env.PORT || 3000
const oneDay = 1000 * 60 * 60 * 24

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: oneDay
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', routes)
app.use((req, res, next) => {
  app.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
