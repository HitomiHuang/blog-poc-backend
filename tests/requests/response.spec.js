const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../util/auth-helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const passport = require('../../config/passport')
const httpStatusCodes = require('../../util/httpStatusCodes')

const loginUser = {
  userName: '@user1',
  name: 'user1',
  password: '12345678',
  email: 'user1@example.com'
}
const normalUser = {
  userName: '@user2',
  name: 'user2',
  password: '12345678',
  email: 'user2@example.com'
}
const dummyStory = {
  id: 'this-is-a-test-story-abcdef123456',
  title: 'This is a test story',
  code: 'abcdef123456',
  content: 'Here is the test content.',
  userId: 2
}

describe('# response requests', () => {
  context('# POST', () => {

    describe('/api/response', () => {
      before(async() => {
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        
        //模擬登入資料
        const rootUser = await db.User.create(loginUser)
        
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
          ).returns({ id: 1, Followings: [] });
        
        await db.User.create(normalUser)
        await db.Story.create(dummyStory)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .post('/api/response')
          .send({
            storyId: ' ',
            content: 'add response test'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - content is blank', (done) => {
        request(app)
          .post('/api/response')
          .send({
            storyId: dummyStory.id,
            content: ' '
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .post('/api/response')
          .send({
            storyId: 'fake-story-id-123456789012',
            content: 'add response test'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/response')
          .send({
            storyId: dummyStory.id,
            content: 'add response test'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function(err, res){
            if (err) return done(err);
            db.Story.findOne({ where: {responseTo: dummyStory.id, userId: 1}}).then(response => {
              response.content.should.equal('add response test')
              return done();
            })
          })
      })

      after(async() => {
        this.getUser.restore()
        this.authenticate.restore()
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

      })
    })    
  })

  context('# PUT', () => {

    describe('/api/response', () => {
      before(async () => {
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        //模擬登入資料
        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, "getUser"
        ).returns({ id: 1, Followings: [] });

        await db.User.create(normalUser)
        await db.Story.create(dummyStory)
        await db.Story.create({ id: 'this-is-a-test-123456789012', title: 'This is a test', code: '123456789012', content: 'This is a test', userId: 1, responseTo: dummyStory.id })
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .put('/api/response')
          .send({
            storyId: ' ',
            content: 'revise response test'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - content is blank', (done) => {
        request(app)
          .put('/api/response')
          .send({
            storyId: 'this-is-a-test-123456789012',
            content: ' '
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function (err, res) {
            if (err) return done(err);
            db.Story.findByPk('this-is-a-test-123456789012').then(response => {
              response.content.should.equal('This is a test')
              return done();
            })
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .put('/api/response')
          .send({
            storyId: 'fake-story-id-123456789012',
            content: 'revise response test'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .put('/api/response')
          .send({
            storyId: 'this-is-a-test-123456789012',
            content: 'revise response test'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function (err, res) {
            if (err) return done(err);
            db.Story.findByPk('this-is-a-test-123456789012').then(response => {
              response.content.should.equal('revise response test')
              return done();
            })
          })
      })

      after(async () => {
        this.getUser.restore()
        this.authenticate.restore()
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

      })
    })
  })

  context('# DELETE', () => {
    describe('/api/response', () => {
      before(async() => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
          callback(null, {...rootUser}, null)
          return (req, res, next) => {}
        })
        this.getUser = sinon.stub(helpers, 'getUser').returns({id: 1, Followings: []})

        await db.User.create(normalUser)
        await db.Story.create(dummyStory)
        await db.Story.create({ id: 'this-is-a-test-123456789012', title: 'This is a test', code: '123456789012', content: 'This is a test', userId: 1, responseTo: dummyStory.id})
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .delete('/api/response')
          .send({
            storyId: '',
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .delete('/api/response')
          .send({
            storyId: 'fake-story-id-123456789012',
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .delete('/api/response')
          .send({ storyId: 'this-is-a-test-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
        .end(function(err, res){
          if(err) return done(err);
          db.Story.findByPk('this-is-a-test-123456789012').then(response => {
            expect(response).to.be.null
            return done()
          })
        })
      })

      after(async() => {
        this.getUser.restore()
        this.authenticate.restore()
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })
  })
})
