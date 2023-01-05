const helper = require('../util/auth-helpers')
const { Story } = require('../models')
const awsHandler = require('../util/aws-helpers')

const storyController = {
  uploadImg: async (req, res, next) => {
    try {
      const user = helper.getUser(req).id
      const story = req.params.storyId
      const filePath = await awsHandler.addImg(user, story, req.file)
      return res.status(200).json({
        status: 'success',
        data: filePath
      })
    } catch (err) {
      next(err)
    }
  },
  addStory: async (req, res, next) => {
    try {
      const user = helper.getUser(req).id
      let { title, content, status } = req.body
      if (title === null) {
        title = content.substring(0, 100)
      }
      await Story.create({
        title,
        content,
        status,
        userId: user
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = storyController
