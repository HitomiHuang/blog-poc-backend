const express = require('express')
const router = express.Router()
// const users = require('./modules/users')
// const userController = require('../controllers/user-controller')

// router.post('/users', userController.signUp)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = router
