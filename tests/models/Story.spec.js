const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const { sequelize, Sequelize } = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Story Model', () => {
  const { DataTypes } = Sequelize
  const StoryFactory = proxyquire('../../models/story', { sequelize: Sequelize })

  let Story

  before(() => {
    Story = StoryFactory(sequelize, DataTypes)
  })

  after(() => {
    Story.init.resetHistory()
  })

  context('properties', () => {
    it('called Story.init with the id parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        id: { type: DataTypes.STRING },
      })
    })
    it('called Story.init with the title parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        title: DataTypes.STRING,
      })
    })
    it('called Story.init with the code parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        code: DataTypes.STRING,
      })
    })
    it('called Story.init with the content parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        content: DataTypes.TEXT,
      })
    })
    it('called Story.init with the status parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        status: DataTypes.STRING,
      })
    })
    it('called Story.init with the userId parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        userId: DataTypes.INTEGER,
      })
    })
    it('called Story.init with the responseTo parameter', () => {
      expect(Story.init).to.have.been.calledWithMatch({
        responseTo: DataTypes.STRING,
      })
    })
  })
  context('associations', () => {
    const User = 'User'

    before(() => {
      Story.associate({ Story })
      Story.associate({ User })
    })

    it('should have many responses', (done) => {
      expect(Story.hasMany).to.have.been.calledWith(Story)
      done()
    })
    it('should belongs to many users', (done) => {
      expect(Story.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should be clapped by many users', (done) => {
      expect(Story.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })
  context('action', () => {
    let data = null
    const dummyStory = {
      id: 'this-is-a-test-370de0a876aa',
      title: 'This is a test',
      code: '370de0a876aa',
      content: 'This is a test. This is a test. This is a test.',
      userId: '1'
    }
    it('create', async () => {
        const story = await db.Story.create(dummyStory)
        data = story
    })
    it('read', async () => {
        const story = await db.Story.findByPk(data.id)
        expect(data.id).to.be.equal(story.id) 
    })
    it('update', async () => {
        await db.Story.update({}, { where: { id: data.id } })
        const story = await db.Story.findByPk(data.id)
        expect(data.updatedAt).not.to.be.equal(story.updatedAt)
    })
    it('delete', async () => {
        await db.Story.destroy({ where: { id: data.id } })
        const story = await db.Story.findByPk(data.id)
        expect(story).to.be.equal(null)
    })
  })
})