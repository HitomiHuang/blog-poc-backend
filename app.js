const express = require('express')
// const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// const corsOptions = {
//   origin: [
//     'http://localhost:8080'
//   ],
//   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }

const app = express()
// app.use(cors(corsOptions))
const passport = require('./config/passport')
const routes = require('./routes')

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use('/api', routes)
app.use((req, res, next) => {
  app.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
module.exports = app
