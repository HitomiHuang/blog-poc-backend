const express = require('express')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const corsOptions = {
  origin: [
    'http://localhost:8080'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()
app.use(cors(corsOptions))

const routes = require('./routes')
const session = require('express-session')
const passport = require('./config/passport')
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
