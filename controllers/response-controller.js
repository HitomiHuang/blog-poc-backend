const { Response } = require('../models')
const generator = require('../util/id-generator')
const helper = require('../util/auth-helpers')

const responseController = {
  try {
    addResponse: async (req, res, next) => {
      const { storyId, content } = req.body
      const responseId = await generator(content)

      await Response.create({id: responseId, content, userId: helper.getUser(req).id, storyId })
      return res.status(200).json({
        status: 'success',
        data:{}
      })
    } catch (err) {
      next(err)
    }
  },
  putResponse: async (req, res, next) => {
    try {
      const { responseId, content } =req.body
      const response = await Response.findByPk(responseId)
      if(!response) throw new Error('response did not exist')
      
      await Response.update({ content })
      return res.status(200).json({
        status: 'success',
        data:{}
      })
    } catch (err) {
      next(err)
    }
  },
  getResponse: async (req, res, next) => {
    try {
      const { responseId } = req.body
      const response = await Response.findByPk(responseId, {
        include: [{ model: Story }]
      })
       if(!response) throw new Error('response did not exist')
      
      return res.status(200).json({
        status: 'success',
        data:{
          response
        }
      })
    } catch (err) {
      next(err)
    }
  },
  removeResponse: async (req, res, next) => {
    try {
      const { responseId } = req.body
      const response = await Response.findByPk(responseId)
      if(!response) throw new Error('response did not exist')
      
      await respoonse.destroy()
      return res.status(200).json({
        status: 'success',
        data:{}
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = responseController
