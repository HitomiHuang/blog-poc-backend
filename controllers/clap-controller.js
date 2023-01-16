const helper = require('../util/auth-helpers')
const { Story, Clap } = require('../models')

const clapController = {
  addClap: async (req, res, next) => {
    try {
      const { storyId } = req.body
      const story = await Story.findByPk(storyId)
      if (!story) throw new Error('Story not exist')

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
      const clap = await Clap.findOne({
        where: {
          userId: helper.getUser(req).id,
          storyId: req.body.storyId
        }
      })

      if (!clap) throw new Error("you haven't clapped this story")

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
