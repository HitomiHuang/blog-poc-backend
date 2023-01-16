const helper = require('../util/auth-helpers')
const { User, Story } = require('../models')
const crypto = require('crypto')
const awsHandler = require('../util/aws-helpers')
const { Op } = require('sequelize')
const { UserNotFoundException } = require('../util/exceptions')

const storyController = {
  getStory: async (req, res, next) => {
    try {
      const { storyId } = req.body
      const story = await Story.findByPk(storyId, {
        where: { responseTo: { [Op.not]: null } },
        attributes: { exclude: ['responseTo'] }
      })
      if (!story) throw new Error('Story did not exist')

      return res.status(200).json({
        status: 'success',
        data: {
          story
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getStories: async (req, res, next) => {
    try {
      const stories = await Story.findAll({
        // include:[
        //   { model: User, as: 'Followers' }
        // ]
      })

      return res.status(200).json({
        status: 'success',
        data: {
          stories
        }
      })
    } catch (err) {
      next(err)
    }
  },
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
        id: crypto.randomBytes(6).toString('hex'),
        title,
        content,
        status,
        userId: user
      })
    } catch (err) {
      next(err)
    }
  },
  putStory: async (req, res, next) => {
    try {
      const user = helper.getUser(req).id
      const { storyId, title, content, status } = req.body
      const story = await User.findByPk(user, {
        include: [
          { model: Story }
        ],
        where: {
          storyId
        }
      })
      if (!story) throw new Error('story not exist')
      console.log(story)

      // await Story.update({
      //   title,
      //   content,
      //   status
      // })

      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  },
  deleteStory: async (req, res, next) => {
    try {

    } catch (err) {
      next(err)
    }
  }
}
module.exports = storyController
