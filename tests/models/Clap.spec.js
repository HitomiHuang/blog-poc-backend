const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const { sequelize, Sequelize } = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Clap Model', () => {
  const { DataTypes } = Sequelize
  const ClapFactory = proxyquire('../../models/clap', { sequelize: Sequelize })

  let Clap

  before(() => {
    Clap = ClapFactory(sequelize, DataTypes)
  })

  after(() => {
    Clap.init.resetHistory()
  })

  context('properties', () => {
    it('called Clap.init with the userId parameter', () => {
      expect(Clap.init).to.have.been.calledWithMatch({
        userId: DataTypes.INTEGER,
      })
    })
    it('called Clap.init with the storyId parameter', () => {
      expect(Clap.init).to.have.been.calledWithMatch({
        storyId: DataTypes.STRING,
      })
    })
  })

  context('action', () => {
    let data = null
    const dummyClap = {
      userId: 1,
      storyId: 'this-is-a-test-370de0a876aa'
    }
    it('create', async () => {
      const clap = await db.Clap.create(dummyClap)
        data = clap
        console.log(clap)
    })
    it('read', async () => {
        const clap = await db.Clap.findByPk(data.id)
        expect(data.id).to.be.equal(clap.id)   
    })
    it('update', async () => {
        await db.Clap.update({}, { where: { id: data.id } })
        const clap = await db.Clap.findByPk(data.id)
        expect(data.updatedAt).not.to.be.equal(clap.updatedAt)
    })
    it('delete', async () => {
        await db.Clap.destroy({ where: { id: data.id } })
        const clap = await db.Clap.findByPk(data.id)
        expect(clap).to.be.equal(null)    
    })
  })
})