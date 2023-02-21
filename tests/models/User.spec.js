const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const { sequelize, Sequelize } = require('sequelize-test-helpers')

const db = require('../../models')

describe('# User Model', () => {
  const { DataTypes } = Sequelize
  const UserFactory = proxyquire('../../models/user', { sequelize: Sequelize })

  let User

  before(() => {
    User = UserFactory(sequelize, DataTypes)
  })

  after(() => {
    User.init.resetHistory()
  })

  context('properties', () => {
    it('called User.init with the userName parameter', () => {
      expect(User.init).to.have.been.calledWithMatch({
        userName: DataTypes.STRING,
      })
    })
    it('called User.init with the name parameter', () => {
      expect(User.init).to.have.been.calledWithMatch({
        name: DataTypes.STRING,
      })
    })
    it('called User.init with the password parameter', () => {
      expect(User.init).to.have.been.calledWithMatch({
        password: DataTypes.STRING,
      })
    })
    it('called User.init with the avatar parameter', () => {
      expect(User.init).to.have.been.calledWithMatch({
        avatar: DataTypes.STRING,
      })
    })
    it('called User.init with the email parameter', () => {
      expect(User.init).to.have.been.calledWithMatch({
        email: DataTypes.STRING,
      })
    })
    it('called User.init with the bio parameter', () => {
      expect(User.init).to.have.been.calledWithMatch({
        bio: DataTypes.TEXT,
      })
    })
  })
  context('associations', () => {
    const Story = 'Story'

    before(() => {
      User.associate({ Story })
      User.associate({ User })
    })

    it('should have many stories', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Story)
      done()
    })
    it('should have many followings and followers', (done) => {
      expect(User.belongsToMany).to.have.been.calledWith(User)
      done()
    })
    it('should clap many stories', (done) => {
      expect(User.belongsToMany).to.have.been.calledWith(Story)
      done()
    })
  })
  context('action', () => {
    let data = null
    const dummyUser = {
      userName: '@user123',
      name: 'user123',
      password: '12345678',
      email: 'user123@example'
    }
    it('create', async () => {
        const user = await db.User.create(dummyUser)
        data = user
    })
    it('read', async () => {
        const user = await db.User.findByPk(data.id)
        expect(data.id).to.be.equal(user.id)
    })
    it('update', async () => {
        await db.User.update({}, { where: { id: data.id } })
        const user = await db.User.findByPk(data.id)
        expect(data.updatedAt).not.to.be.equal(user.updatedAt)     
    })
    it('delete', async () => {  
        await db.User.destroy({ where: { id: data.id } })
        const user = await db.User.findByPk(data.id)
        expect(user).to.be.equal(null)     
    })
  })
})