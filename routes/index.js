const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const storyController = require('../controllers/story-controller')
const upload = require('../middleware/multer')

// router.get('/users/profile', authenticated, userController.getProfile)
router.get('/users/:id/followers', userController.getFollowers)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', authenticated, upload.single('avatar'), userController.putUser)
router.post('/upload-file', upload.single('profile_img'), storyController.uploadImg)
router.post('/signIn', passport.authenticate('local'), userController.signIn)

router.use('/', apiErrorHandler)
module.exports = router
