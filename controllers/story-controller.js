const helper = require('../util/auth-helpers')
const { Story } = require('../models')
const awsHandler = require('../util/aws-helpers')

const storyController = {
  uploadImg: async (req, res, next) => {
    try {
      // const user = helper.getUser(req).id
      const user = 16
      const story = req.params.storyId
      const filePath = await awsHandler.addImg(user, story, req.file)
      return res.status(200).json({
        status: 'success',
        data: filePath
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = storyController
