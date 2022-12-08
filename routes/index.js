const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')
// const users = require('./modules/users')
const userController = require('../controllers/user-controller')

router.post('/signIn', passport.authenticate('local'), userController.signIn)

router.use('/', apiErrorHandler)
module.exports = router
