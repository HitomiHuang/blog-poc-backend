const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../util/auth-helpers')
const should = chai.should()
const expect = chai.expect
const db = require('../../models')
const passport = require('../../config/passport')
const generator = require('../../util/id-generator')
const httpStatusCodes = require('../../util/httpStatusCodes')
const loginUser = {
  userName: '@user123',
  name: 'user123',
  password: '12345678',
  email: 'user123@example'
}

describe('# clap requests', () => {
  context('# POST', () => {

    describe('/api/clap', () => {
      let id;
      let code;
      before(async () => {
        //取消FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        //清除所有資料
        await db.Clap.destroy({ where: {}, truncate: true, force: true })
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

        const title = 'This is test title'
        const content = 'text content!'
        const dummyId = await generator(content, title)
        id = dummyId[0]
        code = dummyId[2]

        const dummyStory = {
          id,
          code,
          title,
          content,
          userId: 2
        }

        await db.Story.create(dummyStory)
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .post('/api/clap')
          .send({
            userId: 1,
            storyId: ' '
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            return done()
          })
      })

      it(' - stroy not found', (done) => {
        request(app)
          .post('/api/clap')
          .send({
            userId: 1,
            storyId: 'bbbbb-123456789012'
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .post('/api/clap')
          .send({
            storyId: id,
            userId: 1
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function (err, res) {
            if (err) return done(err);
            db.Clap.findByPk(1).then(clap => {
              clap.userId.should.equal(1)
              clap.storyId.should.equal(id)
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
        await db.Clap.destroy({ where: {}, truncate: true, force: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Story.destroy({ where: {}, truncate: true, force: true })
        //恢復FK的約束
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

      })
    })
  })

  context('# DELETE', () => {
    describe('/api/clap', () => {
      before(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.Clap.destroy({ where: {}, truncate: true, force: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

        const rootUser = await db.User.create(loginUser)

        this.authenticate = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null)
          return (req, res, next) => { }
        })
        this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1, Followings: [] })

        await db.Clap.create({ storyId: 'this-is-a-test-123456789012', userId: 1 })
      })

      it(' - storyId is blank', (done) => {
        request(app)
          .delete('/api/clap')
          .send({
            storyId: ' '
          })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.BAD_REQUEST)
          .end(function (err, res) {
            return done()
          })
      })

      it(' - story not found', (done) => {
        request(app)
          .delete('/api/clap')
          .send({ storyId: 'this-is-a-failed-test-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.NOT_FOUND)
          .end(function (err, res) {
            return done()
          })
      })

      it(' - successfully', (done) => {
        request(app)
          .delete('/api/clap')
          .send({ storyId: 'this-is-a-test-123456789012' })
          .set('Accept', 'application/json')
          .expect(httpStatusCodes.OK)
          .end(function (err, res) {
            if (err) return done(err);
            db.Clap.findByPk(1).then(clap => {
              expect(clap).to.be.null
              return done()
            })
          })
      })

      after(async () => {
        this.getUser.restore()
        this.authenticate.restore()
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
        await db.Clap.destroy({ where: {}, truncate: true, force: true })
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
      })
    })
  })
})