const express = require('express')
const router = express.Router()
const storyController = require('../../controllers/story-controller')
const upload = require('../../middleware/multer')

router.put('/edit', storyController.putStory)
router.post('/upload-file', upload.single('profile_img'), storyController.uploadImg)
router.delete('/', storyController.deleteStory)
router.post('/add', storyController.addStory)

module.exports = router
