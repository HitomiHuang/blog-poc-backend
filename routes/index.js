const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const userController = require('../controllers/user-controller')

router.post('/signIn', passport.authenticate('local'), userController.signIn)

router.use('/', apiErrorHandler)
module.exports = router
