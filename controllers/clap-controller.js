const helper = require('../util/auth-helpers')
const { Story } = require('../models')
const clapController = {
  addClap: async (req, res, next) => {
    const { storyId, title } = req.body
    const user = helper.getUser(req).id
    const story = await Story.findByPk([storyId, title])

    if (!story) throw new Error('Story not exist')

    
  },
  removeClap: (req, res, next) => {

  }

}
module.exports = clapController
