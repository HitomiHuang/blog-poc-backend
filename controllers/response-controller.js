const { Story } = require('../models')
const helper = require('../util/auth-helpers')
const generator = require('../util/id-generator')
const { NotFoundException } = require('../util/exceptions')

const responseController = {
  addResponse: async (req, res, next) => {
    try {
      const { storyId, title, content } = req.body
      const userId = helper.getUser(req).id

      const story = await Story.findByPk(storyId)
      if (!Story) throw new NotFoundException('Story did not exist')

      const response = await generator(content)
      const id = response[0]
      const code = response[2]

      await Story.create({
        id,
        title: title || content.substring(0, 100).split('\n')[0],
        code,
        content,
        status: 'published',
        userId,
        responseTo: story.id
      })

      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  },
  putResponse: async (req, res, next) => {
    try {
      const { storyId, content } = req.body
      const userId = helper.getUser(req).id

      const response = await Story.findOne({
        where: {
          id: storyId,
          userId
        }
      })
      if (!response) throw new NotFoundException('response did not exist')

      await response.update({
        title: content.substring(0, 100).split('\n')[0],
        content
      })

      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  },
  removeResponse: async (req, res, next) => {
    try {
      const { storyId } = req.body
      const userId = helper.getUser(req).id

      const response = await Story.findOne({
        where: {
          id: storyId,
          userId
        }
      })
      if (!response) throw new NotFoundException('response did not exist')
      await response.destroy()

      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  }

}
module.exports = responseController
