const helper = require('../util/auth-helpers')
const { User, Story, Sequelize } = require('../models')
const { NotFoundException, AuthErrorException } = require('../util/exceptions')
const generator = require('../util/id-generator')
const awsHandler = require('../util/aws-helpers')
const { QueryTypes } = require('sequelize')
const db = require('../models/index')

const storyController = {
  getStory: async (req, res, next) => {
    try {
      const { storyId } = req.body
      const story = await Story.findByPk(storyId, {
        attributes: {
          include: [[Sequelize.col('User.name'), 'name'], [Sequelize.col('User.avatar'), 'avatar']],
          exclude: ['responseTo', 'createdAt']
        },
        include: [{ model: User, attributes: [] }]
      })
      if (!story) throw new NotFoundException('Story did not exist')

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
        where: {
          status: 'published',
          responseTo: null
        },
        attributes: [
          'id',
          'content',
          'updatedAt',
          [Sequelize.col('User.name'), 'name'],
          [Sequelize.col('User.avatar'), 'avatar']
        ],
        include: [
          { model: User, attributes: [] }
        ],
        order: [['updatedAt', 'DESC']]
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
      const userId = helper.getUser(req).id
      let { title, content, status } = req.body
      if (title === null) {
        title = content.substring(0, 100)
      }

      const idArray = await generator(content, title)
      const id = idArray[0]
      const code = idArray[2]

      await Story.create({
        id,
        title,
        code,
        content,
        status,
        userId
      })
      return res.status(200).json({
        status: 'success',
        data: {
          storyId: id
        }
      })
    } catch (err) {
      next(err)
    }
  },
  putStory: async (req, res, next) => {
    try {
      const { storyId, title, content, status } = req.body
      const userId = helper.getUser(req).id
      const story = await Story.findByPk(storyId)
      if (!story) throw new NotFoundException('story not exist')
      if (story.userId !== userId) throw new AuthErrorException('auth error')

      await story.update({
        title,
        content,
        status
      })

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
      const { storyId } = req.body
      const userId = helper.getUser(req).id
      const story = await Story.findByPk(storyId)
      if (!story) throw new NotFoundException('story not exist')
      if (story.userId !== userId) throw new AuthErrorException('auth error')

      const responses = await Story.findAll({
        where: { responseTo: storyId }
      })

      if (responses) {
        await responses.destroy()
      }

      await story.destroy()

      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err) {
      next(err)
    }
  },
  getClaps: async (req, res, next) => {
    try {
      const { storyId } = req.body
      const userId = helper.getUser(req)?.id || null
      const sql = `
        select users.name, users.avatar, users.bio, 
        (select if(followships.following_id = blog_poc.users.id and followships.follower_id='${userId}}', 'true', 'false') from followships) as isFollowed
        from blog_poc.claps
        left join blog_poc.users
        on claps.user_id = users.id
        where claps.story_id = '${storyId}'`
      const clappedUsers = await db.sequelize.query(sql, { type: QueryTypes.SELECT })

      return res.status(200).json({
        status: 'success',
        data: clappedUsers
      })
    } catch (err) {
      next(err)
    }
  },
  getResponses: async (req, res, next) => {
    try {
      const { storyId } = req.bodys
      const sql = `
        select stories.id, stories.content, stories.updated_at, users.name, users.avatar,
        (select count(*) from blog_poc.stories res where res.response_to = stories.id) as responseCount,
        (select count(*) from blog_poc.claps where claps.story_id = stories.id) as clapCount
        from blog_poc.stories
        left join blog_poc.users
        on blog_poc.stories.user_id = blog_poc.users.id
        where stories.response_to = '${storyId}'
        order by stories.updated_at DESC`

      const responses = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT
      })
      if (!responses) throw new NotFoundException('response did not exist')

      return res.status(200).json({
        status: 'success',
        data: {
          responses
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = storyController
