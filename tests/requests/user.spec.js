const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../util/auth-helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const passport = require('../../config/passport')

const loginUser = {
  userName: '@user1',
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}

describe('# user requests', () => {
  context('# POST', () => {
    describe('/api/signIn', () => {
      before(async() => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        
        await db.User.create(loginUser)
      })

      it('- successfully', (done) => {
        request(app)
        .post('/api/signIn')
        .send({
          email: loginUser.email,
          password: loginUser.password
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err)
          res.body.data.user.should.equal('@user1')
          return done()
        })
      })

      after(async() => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/user', () => {
      before(async() => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true})
        await db.User.destroy({where: {}, truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        await db.User.create(loginUser)
      })

      it('- successfully', (done) => {
        request(app)
          .post('/api/user')
          .send({userName: loginUser.userName})
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err)
            (res.body.data.name).should.equal(loginUser.name)
            return done()
          })
      })

      after(async() => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({where:{}, truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/user/followers', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        await db.User.create(loginUser)
        await db.User.create({
          userName: '@user2',
          name: 'user2',
          email: 'user2@example.com',
          password: '12345678'
        })
        await db.Followship.create({followerId: 2, followingId: 1})
      })

      it('- successfully', (done) => {
        request(app)
          .post('/api/user/followers')
          .send({ userName: loginUser.userName })
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            (res.body.data.Followers[0].id).should.equal(2)
            return done()
          })
      })

      after(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })

    describe('/api/user/followings', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        await db.User.create(loginUser)
        await db.User.create({
          userName: '@user2',
          name: 'user2',
          email: 'user2@example.com',
          password: '12345678'
        })
        await db.Followship.create({ followerId: 1, followingId: 2 })
      })

      it('- successfully', (done) => {
        request(app)
          .post('/api/user/followings')
          .send({ userName: loginUser.userName })
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            (res.body.data.Followings[0].id).should.equal(2)
            return done()
          })
      })

      after(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Followship.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })
  })
})
