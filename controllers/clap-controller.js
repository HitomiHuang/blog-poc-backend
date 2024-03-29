const helper = require('../util/auth-helpers')
const { Story, Clap } = require('../models')
const { NotFoundException, InputErrorException } = require('../util/exceptions')

const clapController = {
  addClap: async (req, res, next) => {
    try {
      const storyId = req.body.storyId?.trim()
      if (!storyId) throw new InputErrorException('the field [storyId] is required')
      const story = await Story.findByPk(storyId)
      if (!story) throw new NotFoundException('Story not exist')

      await Clap.create({ userId: helper.getUser(req).id, storyId })

      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  },
  removeClap: async (req, res, next) => {
    try {
      const storyId = req.body.storyId?.trim()
      if (!storyId) throw new InputErrorException('the field [storyId] is required')

      const clap = await Clap.findOne({
        where: {
          userId: helper.getUser(req).id,
          storyId
        }
      })

      if (!clap) throw new NotFoundException("you haven't clapped this story")

      await clap.destroy()

      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  }

}
module.exports = clapController
