const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../util/auth-helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const passport = require('../../config/passport')

describe('# followship requests', () => {
  context('# POST', () => {

    describe('/api/following', () => {
      before(async() => {
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        
        //模擬登入資料
        const dummyUser = {
          userName: '@user123',
          name: 'user123',
          password: '12345678',
          email: 'user123@example'
        }
        const rootUser = await db.User.create(dummyUser)
      })
    })
  })
})
