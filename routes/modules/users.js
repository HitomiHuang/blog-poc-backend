const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/stories/drafts', userController.getDraftStory)
router.get('/stories/public', userController.getPublishedStory)
router.get('/stories/responses', userController.getResponses)
router.put('/', upload.single('avatar'), userController.putUser)

module.exports = router
