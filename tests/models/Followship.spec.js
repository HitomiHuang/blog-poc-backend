const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const { sequelize, Sequelize } = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Followship Model', () => {
  const { DataTypes } = Sequelize
  const FollowshipFactory = proxyquire('../../models/followship', { sequelize: Sequelize })

  let Followship

  before(() => {
    Followship = FollowshipFactory(sequelize, DataTypes)
  })

  after(() => {
    Followship.init.resetHistory()
  })

  context('properties', () => {
    it('called Followship.init with the followerId parameter', () => {
      expect(Followship.init).to.have.been.calledWithMatch({
        followerId: DataTypes.INTEGER,
      })
    })
    it('called Followship.init with the followingId parameter', () => {
      expect(Followship.init).to.have.been.calledWithMatch({
        followingId: DataTypes.INTEGER,
      })
    })
  })
  
  context('action', () => {
    let data = null
    const dummyFollowship = {
      id: 1,
      followingId: 1,
      followerId: 2,
    }
    it('create', async () => {
        const followship = await db.Followship.create(dummyFollowship)
        data = followship
    })
    it('read', async () => {
        const followship = await db.Followship.findByPk(data.id)
        expect(data.id).to.be.equal(followship.id)
    })
    it('update', async () => {
        await db.Followship.update({}, { where: { id: data.id } })
      const followship = await db.Followship.findByPk(data.id)
      expect(data.updatedAt).not.to.be.equal(followship.updatedAt)
    })
    it('delete', async () => {
      await db.Followship.destroy({ where: { id: data.id } })
      const followship = await db.Followship.findByPk(data.id)
      expect(followship).to.be.equal(null)
    })
  })
})